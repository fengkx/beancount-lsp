"""
Modified from https://github.com/Lencerf/vscode-beancount/blob/c6f5c274b17d927a23b884c061cdec1bdab6be6f/pythonFiles/beancheck.py
LICENSE: https://github.com/Lencerf/vscode-beancount/blob/master/LICENSE

```
MIT License

Copyright (c) 2023 Lencerf

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

"""


''' load beancount file and print errors
'''
from collections import defaultdict
from sys import argv
from beancount import loader
from beancount.core import flags
from beancount.core.data import Transaction, Open, Close
from beancount.core.display_context import Align 
from beancount.core.realization import dump_balances, realize
import io
import json
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("file", help="Path to the beancount file")
parser.add_argument("--payeeNarration", action="store_true", help="Include payee and narration information")
parser.add_argument("--output", choices=["default", "errors", "flags"], default="default",
                   help="Select output format: default (accounts info), errors (error list), or flags (flagged entries)")
args = parser.parse_args()


reverse_flag_map = {
    flag_value: flag_name[5:]
    for flag_name, flag_value
        in flags.__dict__.items()
            if flag_name.startswith('FLAG_')
}


def get_flag_metadata(thing):
    return {
        "file": thing.meta['filename'],
        "line": thing.meta['lineno'],
        "message": "{thing} has flag {flag} ({help})".format(
            thing=thing.__class__.__name__,
            flag=reverse_flag_map.get(thing.flag) or thing.flag,
            help=getattr(thing, 'narration',
                    getattr(thing, 'payee',
                        getattr(thing, 'account', r'¯\_(ツ)_/¯')))),
        "flag": thing.flag
    }


entries, errors, options = loader.load_file(args.file)
completePayeeNarration = args.payeeNarration

error_list = [{"file": e.source['filename'], "line": e.source['lineno'], "message": e.message} for e in errors]

output = {}
accounts = {}
automatics = defaultdict(dict)
commodities = set()
payees = set()
narrations = set()
tags = set()
links = set()
flagged_entries = []

for entry in entries:
    if hasattr(entry, 'flag') and entry.flag == "!":
        flagged_entries.append(get_flag_metadata(entry))
    if isinstance(entry, Transaction):
        if completePayeeNarration:
            payees.add(f'{entry.payee}')
        if not entry.narration.startswith("(Padding inserted"):
            if completePayeeNarration:
                narrations.add(f'{entry.narration}')
            tags.update(entry.tags)
            links.update(entry.links)
        txn_commodities = set()
        for posting in entry.postings:
            txn_commodities.add(posting.units.currency)
            if hasattr(posting, 'flag') and posting.flag == "!":
                flagged_entries.append(get_flag_metadata(posting))
            if posting.meta and posting.meta.get('__automatic__', False) is True:
                # only send the posting if more than 2 legs in txn, or multiple commodities
                if len(entry.postings) > 2 or len(txn_commodities) > 1:
                    automatics[posting.meta['filename']][posting.meta['lineno']] = posting.units.to_string()
        commodities.update(txn_commodities)
    elif isinstance(entry, Open):
        accounts[entry.account] = {
            'open': entry.date.__str__(),
            'currencies': entry.currencies if entry.currencies else [],
            'close': "",
            'balance': []
        }
    elif isinstance(entry, Close):
        try:
            accounts[entry.account]['close'] = entry.date.__str__()
        except:
            continue

f = io.StringIO("")
dump_balances(realize(entries), options['dcontext'].build(alignment=Align.DOT,reserved=2), at_cost=True, fullnames=True, file=f)

for line in f.getvalue().split('\n'):
    if len(line) > 0:
        parts = [p for p in line.split(' ', 2) if len(p) > 0]
        if len(parts) > 1:
            stripped_balance = parts[1].strip()
            if len(stripped_balance) > 0:
                try:
                    accounts[parts[0]]['balance'].append(stripped_balance)
                except:
                    continue

payees.discard("")
payees.discard("None")
narrations.discard("")
narrations.discard("None")

output['accounts'] = accounts
output['commodities'] = list(commodities)
output['payees'] = list(payees)
output['narrations'] = list(narrations)
output['tags'] = list(tags)
output['links'] = list(links)

# Output based on the selected format
if args.output == "errors":
    print(json.dumps(error_list))
elif args.output == "flags":
    print(json.dumps(flagged_entries))
else:  # Default output
    print(json.dumps(output))
# print(json.dumps(automatics))