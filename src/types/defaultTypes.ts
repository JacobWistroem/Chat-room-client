export interface user {
    _id: string
    name: string
    email: string
    type: number
    created_ts: Date
}

export interface sortedUsers {
    [key: string]: user
}

export interface message {
    _id: string
    user_id: string
    created_ts: string
    content: string
}

export interface room {
    _id: string
    uuid: string;
    name: string;
    users: string[];
    messages: message[];
    created_ts: string;
    status: string;
};