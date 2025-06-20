#Personal information like name, date of birth, addresses, social security number
#Credit accounts including type of account, balance, and creditor
#Inquires 
#Public records
import re

def analyze_credit_report(text):
    flag_dic = {}
    flag_dic['inquiries'] = pattern_search(text, r'inquiries')
    flag_dic['name'] = pattern_search(text, r'name')
    flag_dic['address'] = pattern_search(text, r'address')
    flag_dic['phone'] = find_phone_num(text, re.compile(r'\(?\d{3}\)?[ .-]?\d{3}[.-]?\d{4}'))
    flag_dic['ssn'] = pattern_search(text, r'ssn|Social Security Number')
    flag_dic['public records'] = pattern_search(text, r'public records')
    flag_dic['personal info'] = pattern_search(text, r'personal information')
    flag_dic['accounts'] = pattern_search(text, r'credit accounts|accounts')
    
    return flag_dic

def pattern_search(text, pattern):
    match = re.search(pattern, text, re.IGNORECASE)
    
    if match:
        return True
    return False

def find_phone_num(text, pattern):
    match = pattern.search(text)
    
    if match:
        return True
    return False