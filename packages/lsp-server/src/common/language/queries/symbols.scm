(transaction
  payee: (payee)? @payee
  narration: (narration) @narration)

(transaction
  date: (date) @date
  (posting
    account: (account) @account_usage))

(pad
  date: (date) @date
  account: (account) @account_usage
  from_account: (account) @account_usage)

(balance
  date: (date) @date
  account: (account) @account_usage)

(close
  date: (date) @date
  account: (account) @account_usage @name) @close

(note
  date: (date) @date
  account: (account) @account_usage)

(document
  date: (date) @date
  account: (account) @account_usage)

(open
  date: (date) @date
  account: (account) @account_definition)

(commodity
  date: (date) @date
  currency: (currency) @currency_definition)

(currency) @currency

(tag) @tag

(link) @link

(pushtag
  (tag) @name) @pushtag

(poptag
  (tag) @name) @poptag

(price
  date: (date) @date
  currency: (currency) @name) @price
