(string) @string

((date) @date)

(transaction
  txn: (txn) @txn)

(transaction (narration) @narration)

(transaction (payee) @payee)

((account) @account)

(open (account) @account_definition)

(number) @number

(currency) @currency

[
 (option
   "option"  @keyword)
 (plugin
   "plugin" @keyword)
 (include
   "include" @keyword)
 (popmeta
   "popmeta" @keyword)
 (pushmeta
   "pushmeta" @keyword)
 (poptag
   "poptag" @keyword)
 (pushtag
   "pushtag" @keyword)
 (balance
   "balance" @keyword)
 (query
   "query" @keyword)
 (note
   "note" @keyword)
 (document
   "document" @keyword)
 (close
   "close" @keyword)
 (commodity
   "commodity" @keyword)
 (custom
   "custom" @keyword)
 (event
   "event" @keyword)
 (open
   "open" @keyword)
 (pad
   "pad" @keyword)
 (price
   "price" @keyword)
]

(tag) @tag

(link) @link

(key_value
  (key) @kv_key)

(bool) @bool

(comment) @comment


