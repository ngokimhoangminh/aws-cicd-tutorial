import os
import boto3

def handler(event, context):
    # handle event.
    url = event["rawPath"]

    if url != "/":
        return {"statusCode": 404, "body": "Not found."}

    # Get a reference to the DDB table.
    table = _get_table()

    response = table.get_item(Key={"key": "number_accesses"})

    if "Item" in response:
        number_accesses = response["Item"]["value"]
    else:
        number_accesses = 0

    new_number_accesses = number_accesses + 1
    table.put_item(Item={"key": "number_accesses", "value": new_number_accesses})

    version = os.environ.get("VERSION", "0.0")
    response_body = {
        "message": "🖖 🖖 Hello World 🖖 👋",
        "version": version,
        "number_accesses": new_number_accesses,
    }

    return {"status_code": 200, "body": response_body}

def _get_table():
    table_name = os.environ.get("TABLE_NAME")

    return boto3.resource("dynamodb").Table(table_name)