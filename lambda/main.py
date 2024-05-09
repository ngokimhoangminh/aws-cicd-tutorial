def handler(event, context):
    response_body = {
        "message": "Hello World 👋",
        "version": "1.0.0",
    }

    return {"status_code": 200, "body": response_body}