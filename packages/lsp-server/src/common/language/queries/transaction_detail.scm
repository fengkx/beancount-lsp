(transaction
  date: (date)? @date
  txn: (txn)? @txn
  (posting
    account: (account) @account
    amount: (incomplete_amount)? @amount
    cost_spec: (cost_spec)? @cost_spec
    price_annotation: (price_annotation)? @price) @posting
) @transaction


