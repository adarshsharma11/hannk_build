const PAYPAL_URL = {
    "DEV": {
        PAYPAL_TOKEN_URL:'https://api-m.sandbox.paypal.com/v1/oauth2/token',
        PAYPAL_CAPTURE_URL: 'https://api-m.sandbox.paypal.com/v2/checkout/orders',
    },
    "LIVE": {
        PAYPAL_TOKEN_URL: 'https://api-m.paypal.com/v1/oauth2/token',
        PAYPAL_CAPTURE_URL: 'https://api-m.paypal.com/v2/checkout/orders',
    }
}

export const getPaypalUrls = (env: "DEV" | "LIVE") => {
    return PAYPAL_URL[env]
}