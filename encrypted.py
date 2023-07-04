import PyPDF2

def remove_password(input_pdf_path, output_pdf_path, password):
    with open(input_pdf_path, 'rb') as input_file:
        pdf_reader = PyPDF2.PdfReader(input_file)
                
        if not pdf_reader.is_encrypted:
            print("The PDF file is not password-protected.")
            return
        
        pdf_reader.decrypt(password)  # Remove the password

        with open(output_pdf_path, 'wb') as output_file:
            pdf_writer = PyPDF2.PdfWriter()
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                pdf_writer.add_page(page)
            
            pdf_writer.write(output_file)

# Usage example
input_pdf_path = 'C:/Users/Administrator/harish/prism_windows2/public/uploads/XXXPM_3224_X_2022_23_AIS_3_7833570291.pdf'
output_pdf_path = 'C:/Users/Administrator/harish/prism_app2/ais/ais.pdf'
password = 'ctxpm3224n08031997'

remove_password(input_pdf_path, output_pdf_path, password)
