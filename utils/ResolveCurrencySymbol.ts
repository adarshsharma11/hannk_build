export default (currency: string = "usd") => {

    if (currency == 'eur' || currency == 'EUR') return '€'
    if (currency == 'usd' || currency == 'USD') return '$'
    if (currency == 'gbp' || currency == 'GBP') return '£'

    return '$'
}