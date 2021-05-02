import os
import json
import gspread
from oauth2client.service_account import ServiceAccountCredentials

#https://webhookpnck.herokuapp.com/facebook
# read that file for how to generate the creds and how to use gspread to read and write to the spreadsheet

# use creds to create a client to interact with the Google Drive API
scopes = ['13BMq0XCj4V852vWNcB8ErSkNZ5gPX7wAYbi7M7sgwzU';]
json_creds = os.getenv("service_account.json")

creds_dict = json.loads(json_creds)
creds_dict["private_key"] = creds_dict["private_key"].replace("\\\\n", "\n")
creds = ServiceAccountCredentials.from_json_keyfile_dict(creds_dict, scopes)
client = gspread.authorize(creds)

# Find a workbook by url
spreadsheet = client.open_by_url("https://docs.google.com/spreadsheets/d/13BMq0XCj4V852vWNcB8ErSkNZ5gPX7wAYbi7M7sgwzU/edit#gid=704459328&quot;)
sheet = spreadsheet.sheet1

# Extract and print all of the values
rows = sheet.get_all_records()
print(rows)
