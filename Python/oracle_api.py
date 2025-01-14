import requests

def transfer_amount(name, city):
    url = 'https://jsonmock.hackerrank.com/api/transactions'
    credit_max = 0
    debit_max = 0
    page = 1

    while True:
        try:
            print(f"Fetching data from page: {page}")
            response = requests.get(f"{url}?page={page}")
            response.raise_for_status()  # Raise an error for HTTP issues
            data = response.json()

            print(f"Data from page {page}: {data.get('data', [])}")

            # Iterate over the transaction records on this page
            for transaction in data.get('data', []):
                print(f"Processing Transaction: ID={transaction.get('id')}")
                print(f"Transaction Name: {transaction.get('userName')}, City: {transaction.get('location', {}).get('city')}")

                # Match username and city
                is_name_match = transaction.get('userName') == name
                is_city_match = transaction.get('location', {}).get('city') == city

                print(f"Match Found: Name={is_name_match}, City={is_city_match}")

                if is_name_match and is_city_match:
                    try:
                        amount = float(
                            transaction.get('amount', '0')
                            .replace('$', '')
                            .replace(',', '')
                        )
                    except ValueError:
                        print(f"Error converting amount: {transaction.get('amount')}")
                        amount = 0

                    # Check if it's a credit or debit transaction
                    txn_type = transaction.get('txnType')
                    if txn_type == 'credit':
                        credit_max = max(credit_max, amount)
                        print(f"Updated Credit Max: {credit_max}")
                    elif txn_type == 'debit':
                        debit_max = max(debit_max, amount)
                        print(f"Updated Debit Max: {debit_max}")

            # Check if we've reached the last page
            if page >= data.get('total_pages', 0):
                print("Reached the last page.")
                break

            page += 1

        except requests.exceptions.RequestException as e:
            print(f"Request Error on page {page}: {str(e)}")
            break

    print(f"Final Credit Max: {credit_max}, Final Debit Max: {debit_max}")
    # Return the result in currency format
    return [f"${credit_max:.2f}", f"${debit_max:.2f}"]
