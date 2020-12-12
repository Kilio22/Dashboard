export interface MicrosoftMail {
    id: string;
    receivedDateTime: string;
    subject: string;
    isRead: boolean;
    webLink: string;
    sender: {
        emailAddress: {
            address: string;
        }
    };
}
