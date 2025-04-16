import { codeBlock, oneLine } from 'proper-tags';

export const BQL_SYNTAX = codeBlock`
${oneLine`
Beancount modify the SQL SELECT syntax to provide a two-level filtering syntax:
since we have a single table of data,
we replace the table name in FROM by a filtering expression which applies over transactions, and the WHERE clause applies to data pulled from the resulting list of postings:
`}
${oneLine`
SELECT <target1>, <target2>, …
FROM <entry-filter-expression>
WHERE <posting-filter-expression>;
 `}
${oneLine`Both filtering expressions are optional.
If no filtering expressions are provided,
all postings will be enumerated over.
Note that since the transactions are always filtered in date order,
the results will be processed and returned in this order by default.`}
`;

export const BQL_COLUMNS = codeBlock`
Available columns(Any columns not listed are INVALID! You can only pick column from the list):
'account': str.
'balance': Inventory.
'change': Position.
'cost_currency': str.
'cost_date': date.
'cost_label': str.
'cost_number': Decimal.
'currency': str.
'date': date.
'day': int.
'description': str.
'filename': str.
'flag': str.
'id': str.
'lineno': int.
'links': set.
'location': str.
'month': int.
'narration': str.
'number': Decimal.
'other_accounts': set.
'payee': str.
'position': Position.
'posting_flag': str.
'price': Amount.
'tags': set.
'type': str.
'weight': Amount.
'year': int.
`;

export const BQL_FUNCTIONS = codeBlock`
Simple functions. Any function not listed is INVALID! The valid function arguments type and number of arguments is wrap in bracket:

'ABS(Decimal|Inventory|Position)': Get length
'ACCOUNT_SORTKEY(str)': Get sort key
'ANY_META(str)': Get metadata
'CLOSE_DATE(str)': Get close date
'COALESCE(object,object)': First non-null
'COMMODITY(Amount)': Get currency
'COMMODITY_META(str)': Get metadata
'CONVERT(Amount|Inventory|Position,str[,date])': Convert currency
'COST(Inventory|Position)': Get cost
'CURRENCY(Amount)': Get currency
'CURRENCY_META(str)': Get metadata
'DATE(int,int,int|str)': Create date
'DATE_ADD(date,int)': Add days
'DATE_DIFF(date,date)': Days diff
'DAY(date)': Get day
'ENTRY_META(str)': Get metadata
'FILTER_CURRENCY(Inventory|Position,str)': Filter currency
'FINDFIRST(str,set)': First match
'GETITEM(dict,str)': Get value
'GETPRICE(str,str[,date])': Get price
'GREP(str,str)': Match string
'GREPN(str,str,int)': Get subgroup
'JOINSTR(set)': Join strings
'LEAF(str)': Get leaf
'LENGTH(list|set|str)': Get length
'LOWER(str)': Lowercase
'MAXWIDTH(str,int)': Truncate
'META(str)': Get metadata
'MONTH(date)': Get month
'NEG(Amount|Decimal|Inventory|Position)': Negate
'NUMBER(Amount)': Get number
'ONLY(str,Inventory)': Get amount
'OPEN_DATE(str)': Get open date
'OPEN_META(str)': Get metadata
'PARENT(str)': Get parent
'POSSIGN(Amount|Decimal|Inventory|Position,str)': Fix sign
'QUARTER(date)': Get quarter
'ROOT(str,int)': Get root
'SAFEDIV(Decimal,Decimal|int)': Safe divide
'STR(object)': To string
'SUBST(str,str,str)': Replace
'TODAY()': Today
'UNITS(Inventory|Position)': Get units
'UPPER(str)': Uppercase
'VALUE(Inventory|Position[,date])': Get value
'WEEKDAY(date)': Get weekday
'YEAR(date)': Get year
'YMONTH(date)': Get year+month

Aggregate functions:
'COUNT(object)': Count
'FIRST(object)': First
'LAST(object)': Last
'MAX(object)': Max
'MIN(object)': Min
'SUM(Amount|Inventory|Position|int|float|Decimal)': Sum`;

export const BQL_QUERY_EXAMPLES = codeBlock`
My beancount has accounts : Asset:Bank, Income:Salary, Expenses:Rent, Expenses:Food, Expenses:Traffic
给出上个两个月的收入:
    SELECT account, sum(convert(position, 'CNY')) as total, year, month WHERE account ~ "^Income:*" and date > date_add(today(), -60) GROUP BY account,year, month ORDER BY total DESC
Today is Thu Jun 22 2023. My beancount has accounts : Asset:Funds, Asset:Bank, Income:Salary, Expenses:Rent, Expenses:Food
给出上个季度的房租花销:
    SELECT date, description, account, position WHERE year = 2023 AND quarter(date) = '2023-Q1' AND account = "Expenses:Rent"  ORDER BY date DESC

`;
