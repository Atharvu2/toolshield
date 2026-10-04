def can_trigger(token_type: str, event_type: str) -> bool:
    if token_type == "github_token":
        return event_type in ["workflow_dispatch", "repository_dispatch"]
    if token_type in ["github_app_installation_token", "pat"]:
        return True
    return False
