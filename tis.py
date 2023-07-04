import fitz
import requests


def find_the_first_table_data(data):        
    num_columns = 4  # Number of columns in each row
    table_data = []
    row = []
    sno_index = 0  # Index of the 'SR. NO.' column
    category_index = 1  # Index of the 'INFORMATION CATEGORY' column
    for item in data:
        row.append(item)
        if len(row) == num_columns:
            table_data.append(row)
            row = []
        elif len(row) > num_columns:
            table_data.append(row[:num_columns])
            row = row[num_columns:]

    # Store values in a dictionary based on 'INFORMATION CATEGORY'
    dict_data = {}
    for row in table_data[1:]:  # Exclude the header row
        sno = row[sno_index]
        category = row[category_index]
        processed_value = row[category_index + 1]
        derived_value = row[category_index + 2]
        dict_data[category] = {
            'sno': sno,
            'PROCESSED VALUE': processed_value,
            'DERIVED VALUE': derived_value
        }

    return dict_data





def destructure_the_tis(changed_lines):
    dict_a={}
    # print(changed_lines)
    dict_a["panNumber"]=changed_lines[4]
    dict_a["aadhaar_number"]=changed_lines[5]
    dict_a["name_of_assessee"]=changed_lines[6]
    dict_a["dob"]=changed_lines[10]
    dict_a["mobile_no"]=changed_lines[11]
    dict_a["email"]=changed_lines[12]
    dict_a["address"]=changed_lines[14]
    # print(dict_a)
    start_index=changed_lines.index("(All amount values are in INR)")+2
    end_index = changed_lines.index('The information details under each information category is provided on next page.')
    main_table_data=changed_lines[start_index:end_index]
    # print(main_table_data)
    table_data=find_the_first_table_data(main_table_data)
    data={
        "panNamber":dict_a['panNumber'],
        "mainDetails":dict_a,
        "tabelDetails":main_table_data      
    }
    print(data)

    url = "http://ec2-13-234-30-250.ap-south-1.compute.amazonaws.com:1337/api/tistabledetails"

    payload = {
        "data": data
    }
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 46f7627949496b15b36aadbbf590db7a079ddfafe33ea2db0b6e25ca525eff20099c19d999cd556972ca316d37cb7a283ad1db9ad5e466d74720b59600769e7393a14bd7023f1da6e9cdc97251a91fd6964caf0d7bdc648ac5e6e0f70ba6074ca776c009b0a1f02ef18738c9a6d291af5403d8d697083a7c54f85265edfcfe87'
    }

    response = requests.post(url, json=payload, headers=headers)
    # print(response)


def is_encrypted(file):
    pdf = fitz.open(file)
    encrypted = pdf.is_encrypted
    pdf.close()
    return encrypted

    

file='C:/Users/Administrator/harish/prism_windows2/public/uploads/XXXPM_3224_X_2022_23_TIS_4_9600214cac.pdf'
password="ctxpm3224n08031997"
# file='./XXXPR2359X_2022-23_TIS.pdf'
# password="bifpr2359f20041991"

# file = './XXXPM0989X_2022-23_TIS.pdf'
# password = "acipm0989n14111961"

changed_lines = []  # List to store changed lines

if is_encrypted(file):
    pdf = fitz.open(file)
    if pdf.authenticate(password):
        for page_num in range(len(pdf)):
            page = pdf.load_page(page_num)
            text = page.get_text('')
            # print(text)
            rows = text.split('\n')  # Split the text into rows using '\n' as the delimiter
            # print(f"Page {page_num + 1}:")
            for row in rows:
                  # Check if the row is already in the list
                changed_lines.append(row)
                # print(row)
    else:
        print("Incorrect password")
    pdf.close()
else:
    pdf = fitz.open(file)
    for page_num in range(len(pdf)):
        page = pdf.load_page(page_num)
        text = page.get_text('html')
        rows = text.split('\n')  # Split the text into rows using '\n' as the delimiter
        # print(f"Page {page_num + 1}:")
        for row in rows:
            changed_lines.append(row)
            # print(row)
    pdf.close()
destructure_the_tis(changed_lines)