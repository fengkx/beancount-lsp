from beancount.parser import parser

def parse_bean_file(file_path):
    """解析 beancount 文件并返回解析结果"""
    try:
        # 使用 beancount parser 解析文件
        entries, errors, options_map = parser.parse_file(file_path)
        
        print(f"成功解析文件: {file_path}")
        print(f"条目数量: {len(entries)}")
        print(f"错误数量: {len(errors)}")
        
        # 打印所有条目
        for i, entry in enumerate(entries):
            print(f"\n条目 {i+1}:")
            print(f"  日期: {entry.date}")
            print(f"  类型: {type(entry).__name__}")
            print(f"  描述: {entry.narration}")
            
            # 如果是交易条目，打印账户和金额
            if hasattr(entry, 'postings'):
                print("  账户:")
                for posting in entry.postings:
                    account = posting.account
                    units = posting.units
                    print(f"    {account}: {units}")
        
        # 如果有错误，打印错误信息
        if errors:
            print(f"\n解析错误:")
            for error in errors:
                print(f"  {error}")
                
        return entries, errors, options_map
        
    except Exception as e:
        print(f"解析文件时出错: {e}")
        return None, None, None

if __name__ == "__main__":
    # 解析测试文件
    file_path = "../beancount-lsp/test_transaction.bean"
    entries, errors, options_map = parse_bean_file(file_path)
