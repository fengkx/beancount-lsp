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

""" load beancount file and print errors
"""
from collections import defaultdict
from decimal import Decimal
import os
import sys
import traceback
from beancount import loader
from beancount.core import convert, flags
from beancount.core.data import Transaction, Open, Close, Pad
from beancount.core.display_context import Align
from beancount.core.realization import (
    compute_balance,
    dump_balances,
    realize,
    iter_children,
)
import io
import json
import argparse

reverse_flag_map = {
    flag_value: flag_name[5:]
    for flag_name, flag_value in flags.__dict__.items()
    if flag_name.startswith("FLAG_")
}


def get_flag_metadata(thing):
    help = getattr(thing, "narration", "")
    if help == "":
        help = getattr(thing, "payee", getattr(thing, "account", r"¯\_(ツ)_/¯"))
    return {
        "file": thing.meta["filename"],
        "line": thing.meta["lineno"],
        "message": "{thing} has flag {flag} ({help})".format(
            thing=thing.__class__.__name__,
            flag=reverse_flag_map.get(thing.flag) or thing.flag,
            help=help,
        ),
        "flag": thing.flag,
    }


def _account_score(item):
    values = item[1].values()
    return sum(abs(v) for v in values)

def _pad_ref_from_meta(meta):
    if not meta:
        return None, None
    pad_meta = meta.get("__pad__")
    if isinstance(pad_meta, dict):
        filename = pad_meta.get("filename")
        lineno = pad_meta.get("lineno")
        if filename and lineno:
            return filename, lineno
    filename = meta.get("filename")
    lineno = meta.get("lineno")
    if filename and lineno:
        return filename, lineno
    return None, None

def run_beancheck(file: str, payee_narration: bool = False):
    entries, errors, options = loader.load_file(file)
    completePayeeNarration = payee_narration
    ZERO = Decimal(0)

    error_list = [
        {"file": e.source["filename"], "line": e.source["lineno"], "message": e.message}
        for e in errors
    ]

    general = {}
    accounts = {}
    # Keep this map for backward compatibility with previous logic.
    automatics = defaultdict(dict)
    pad_entries = {}
    pad_amounts = defaultdict(lambda: defaultdict(dict))
    commodities = set()
    payees = set()
    narrations = set()
    tags = set()
    links = set()
    flagged_entries = []

    for entry in entries:
        if isinstance(entry, Pad):
            meta = entry.meta or {}
            filename = meta.get("filename")
            lineno = meta.get("lineno")
            if filename and lineno:
                normalized = os.path.normpath(filename)
                pad_entries[(normalized, lineno)] = entry
                pad_entries[(os.path.basename(normalized), lineno)] = entry
        if hasattr(entry, "flag") and entry.flag == "!":
            flagged_entries.append(get_flag_metadata(entry))
        if isinstance(entry, Transaction):
            if completePayeeNarration:
                payees.add(f"{entry.payee}")
            if not entry.narration.startswith("(Padding inserted"):
                if completePayeeNarration:
                    narrations.add(f"{entry.narration}")
                tags.update(entry.tags)
                links.update(entry.links)
            txn_commodities = set()
            for posting in entry.postings:
                txn_commodities.add(posting.units.currency)
                if hasattr(posting, "flag") and posting.flag == "!":
                    flagged_entries.append(get_flag_metadata(posting))
                if posting.meta and posting.meta.get("__automatic__", False) is True:
                    # only send the posting if more than 2 legs in txn, or multiple commodities
                    if len(entry.postings) > 2 or len(txn_commodities) > 1:
                        amounts = automatics[posting.meta["filename"]].get(
                            posting.meta["lineno"], []
                        )
                        amounts.append(posting.units.to_string())
                        automatics[posting.meta["filename"]][posting.meta["lineno"]] = (
                            amounts
                        )
            commodities.update(txn_commodities)
        elif isinstance(entry, Open):
            accounts[entry.account] = {
                "open": entry.date.__str__(),
                "currencies": entry.currencies if entry.currencies else [],
                "close": "",
                "balance": [],
                "balance_incl_subaccounts": [],
            }
        elif isinstance(entry, Close):
            try:
                accounts[entry.account]["close"] = entry.date.__str__()
            except:
                continue

    for entry in entries:
        if not isinstance(entry, Transaction):
            continue
        if not entry.narration.startswith("(Padding inserted"):
            continue
        filename, lineno = _pad_ref_from_meta(entry.meta or {})
        if not filename or not lineno:
            for posting in entry.postings:
                filename, lineno = _pad_ref_from_meta(posting.meta or {})
                if filename and lineno:
                    break
        if not filename or not lineno:
            continue
        filename = os.path.normpath(filename)
        pad_entry = pad_entries.get((filename, lineno))
        if not pad_entry:
            pad_entry = pad_entries.get((os.path.basename(filename), lineno))
        target_account = pad_entry.account if pad_entry else None
        totals = pad_amounts[filename][lineno]
        per_account_totals = defaultdict(dict) if not target_account else None
        for posting in entry.postings:
            if posting.units is None:
                continue
            currency = posting.units.currency
            number = posting.units.number
            if number is None:
                continue
            if target_account:
                if posting.account != target_account:
                    continue
                totals[currency] = totals.get(currency, ZERO) + number
            else:
                account_totals = per_account_totals[posting.account]
                account_totals[currency] = account_totals.get(currency, ZERO) + number

        if not target_account and per_account_totals:
            _, chosen_totals = max(per_account_totals.items(), key=_account_score)
            for currency, number in chosen_totals.items():
                totals[currency] = totals.get(currency, ZERO) + number

    f = io.StringIO("")
    realized_entries = realize(entries)
    dump_balances(
        realized_entries,
        options["dcontext"].build(alignment=Align.DOT, reserved=2),
        at_cost=True,
        fullnames=True,
        file=f,
    )

    for line in f.getvalue().split("\n"):
        if len(line) > 0:
            parts = [p for p in line.split(" ", 2) if len(p) > 0]
            if len(parts) > 1:
                stripped_balance = parts[1].strip()
                if len(stripped_balance) > 0:
                    try:
                        accounts[parts[0]]["balance"].append(stripped_balance)
                    except:
                        continue

    for real_account in iter_children(realized_entries):
        inventory = compute_balance(real_account)
        if accounts.get(real_account.account) is None:
            continue
        for position in inventory.reduce(convert.get_cost).get_positions():
            accounts[real_account.account]["balance_incl_subaccounts"].append(
                position.units.to_string()
            )

    payees.discard("")
    payees.discard("None")
    narrations.discard("")
    narrations.discard("None")

    general["accounts"] = accounts
    general["commodities"] = list(commodities)
    general["payees"] = list(payees)
    general["narrations"] = list(narrations)
    general["tags"] = list(tags)
    general["links"] = list(links)

    output = {}
    output["errors"] = error_list
    output["general"] = general
    output["flags"] = flagged_entries
    pad_output = {}
    for filename, line_map in pad_amounts.items():
        pad_output[filename] = {}
        for lineno, currency_map in line_map.items():
            amounts = []
            for currency, number in currency_map.items():
                if number == 0:
                    continue
                amounts.append({"number": str(number), "currency": currency})
            if amounts:
                pad_output[filename][str(lineno)] = amounts
    output["pads"] = pad_output
    return output


def _write_rpc_message(payload):
    body = json.dumps(payload, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    header = f"Content-Length: {len(body)}\r\n\r\n".encode("ascii")
    stdout = sys.stdout.buffer
    stdout.write(header)
    stdout.write(body)
    stdout.flush()


def _read_rpc_message():
    stdin = sys.stdin.buffer
    headers = {}

    while True:
        line = stdin.readline()
        if not line:
            return None
        if line in (b"\r\n", b"\n"):
            break
        decoded = line.decode("ascii", errors="replace").strip()
        if ":" not in decoded:
            continue
        key, value = decoded.split(":", 1)
        headers[key.strip().lower()] = value.strip()

    length_raw = headers.get("content-length")
    if not length_raw:
        return None

    try:
        content_length = int(length_raw)
    except ValueError:
        return None

    if content_length < 0:
        return None

    body = stdin.read(content_length)
    if not body or len(body) != content_length:
        return None

    try:
        return json.loads(body.decode("utf-8"))
    except json.JSONDecodeError:
        return None


def _serve_rpc_stdio():
    cancelled_request_ids = set()
    shutdown_requested = False

    while True:
        message = _read_rpc_message()
        if message is None:
            return

        if not isinstance(message, dict):
            continue
        if message.get("jsonrpc") != "2.0":
            continue

        method = message.get("method")
        request_id = message.get("id")
        params = message.get("params")
        params = params if isinstance(params, dict) else {}

        if method == "$/cancelRequest":
            cancel_id = params.get("id")
            if cancel_id is not None:
                cancelled_request_ids.add(cancel_id)
            continue

        if method == "shutdown":
            shutdown_requested = True
            if request_id is not None:
                _write_rpc_message(
                    {
                        "jsonrpc": "2.0",
                        "id": request_id,
                        "result": None,
                    }
                )
            if shutdown_requested:
                return

        if method == "beancheck/run":
            if request_id in cancelled_request_ids:
                cancelled_request_ids.discard(request_id)
                if request_id is not None:
                    _write_rpc_message(
                        {
                            "jsonrpc": "2.0",
                            "id": request_id,
                            "error": {
                                "code": -32800,
                                "message": "Request cancelled",
                            },
                        }
                    )
                continue

            file = params.get("file")
            if not isinstance(file, str) or file == "":
                if request_id is not None:
                    _write_rpc_message(
                        {
                            "jsonrpc": "2.0",
                            "id": request_id,
                            "error": {
                                "code": -32602,
                                "message": "Invalid params: 'file' must be a non-empty string",
                            },
                        }
                    )
                continue

            payee_narration = bool(params.get("payeeNarration", False))
            try:
                result = run_beancheck(file, payee_narration)
                if request_id is not None:
                    _write_rpc_message(
                        {
                            "jsonrpc": "2.0",
                            "id": request_id,
                            "result": result,
                        }
                    )
            except Exception as error:
                if request_id is not None:
                    _write_rpc_message(
                        {
                            "jsonrpc": "2.0",
                            "id": request_id,
                            "error": {
                                "code": -32001,
                                "message": str(error),
                                "data": traceback.format_exc(),
                            },
                        }
                    )
            continue

        if request_id is not None:
            _write_rpc_message(
                {
                    "jsonrpc": "2.0",
                    "id": request_id,
                    "error": {
                        "code": -32601,
                        "message": f"Method not found: {method}",
                    },
                }
            )


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("file", nargs="?", help="Path to the beancount file")
    parser.add_argument(
        "--payeeNarration",
        action="store_true",
        help="Include payee and narration information",
    )
    parser.add_argument(
        "--rpc-stdio",
        action="store_true",
        help="Run as a JSON-RPC stdio server using LSP-style Content-Length framing",
    )
    args = parser.parse_args()
    if args.rpc_stdio:
        _serve_rpc_stdio()
        return

    if not args.file:
        parser.error("the following arguments are required: file")

    output = run_beancheck(args.file, args.payeeNarration)
    print(json.dumps(output))


if __name__ == "__main__":
    main()
