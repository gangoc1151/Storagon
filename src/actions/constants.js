export const server_url = 'https://storagon.com'

function CreateEnum(filterList) {
    var enumDict = {};
    for (var i in filterList) {
        enumDict[filterList[i]] = i;
    }
    return enumDict;
}

export const FlagFilter = ['ok', 'warning', 'error', 'critical'];
export const Flag = CreateEnum(FlagFilter);
export const AccountTypeFilter = ['user', 'affiliate', 'reseller', 'affiliatePPD'];
export const AccountType = CreateEnum(AccountTypeFilter);
export const BalanceTypeFilter = ['credit', 'point', 'paypal', 'webmoney', 'ppd credit'];
export const BalanceType = CreateEnum(BalanceTypeFilter);
export const AccountStatusFilter = ['normal', 'emailNotActivated', 'banned', 'temporary'];
export const AccountStatus = CreateEnum(AccountStatusFilter);
export const ApplyTypeFilter = ['Become Affiliate', 'Withdraw Money', 'Switch mode to affiliate PPD', 'Switch mode to affiliate PPS'];
export const ApplyType = CreateEnum(ApplyTypeFilter);
export const ApplyStatusFilter = ['Processing', 'Accepted', 'Rejected'];
export const ApplyStatus = CreateEnum(ApplyStatusFilter);
export const FolderTypeFilter = ['normal', 'recycle'];
export const FolderType = CreateEnum(FolderTypeFilter);
export const ServerStatusFilter = ['normal', 'offline', 'downloadOnly'];
export const ServerStatus = CreateEnum(ServerStatusFilter);
export const TransactionTypeFilter = ['agency', 'referer', 'website', 'rebill'];
export const TransactionType = CreateEnum(TransactionTypeFilter);
export const SessionTypeFilter = ['upload', 'download', 'bill', 'delete', 'report', 'inbox', 'move'];
export const SessionType = CreateEnum(SessionTypeFilter);
export const SessionStatusFilter = ['waiting', 'working', 'completed', 'failed'];
export const SessionStatus = CreateEnum(SessionStatusFilter);
export const OrderNumberFilter = ['first', 'second', 'third', 'fourth'];
export const OrderNumber = CreateEnum(OrderNumberFilter);
export const DowloadTypeFilter = ['none', 'torrent', 'browser', 'direct'];
export const DownloadType = CreateEnum(DowloadTypeFilter);

export function convertFilesize(bytes, canUnlimited = true) {
    var units = [
        'bytes',
        'KB',
        'MB',
        'GB',
        'TB',
        'PB'
    ];
    if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) {
        return '?';
    }
    if (bytes === 0 && canUnlimited)
        return 'Unlimited';
    var unit = 0;
    while (bytes >= 1024) {
        bytes /= 1024;
        unit++;
    }
    return bytes.toFixed(2) + ' ' + units[unit];
}

var units = ['SEC', 'HOUR', 'DAY', 'WEEK', 'MONTH', 'YEAR']
export function convertDuration(seconds) {
    if (isNaN(parseFloat(seconds)) || !isFinite(seconds)) {
        return '?';
    }
    var unit = 0;
    if (seconds >= 3600) {
        seconds /= 3600;
        unit += 1;
    }
    //day
    if (seconds >= 24) {
        seconds /= 24;
        unit += 1;
    }
    //weeks
    if (seconds >= 7) {
        seconds /= 7;
        unit += 1;
    }
    //months
    if (seconds >= 4) {
        seconds /= 4;
        unit += 1;
    }
    //years
    if (seconds >= 12) {
        seconds /= 12;
        unit += 1;
    }
    return seconds.toFixed(0) + ' ' + units[unit];
}

export function convertCurrency(input, symbol, place) {
    if (isNaN(input)) {
        return input;
    } else {
        // Check if optional parameters are passed, if not, use the defaults
        var symbol = symbol || '$';
        var place = place === undefined ? true : place;

        // Perform the operation to set the symbol in the right location
        if (place === true) {
            return symbol + input.toFixed(2);
        } else {
            return input.toFixed(2) + symbol;
        }
    }
}

export function convertAmount(input, balanceType) {
    switch (balanceType) {
        case 0:
        case "pps":
            return Math.round((input / 100) * 1000) / 1000;
            break;
        case 1:
            return input;
            break;
        case 4:
        case "ppd":
            return Math.round((input / 100000) * 1000) / 1000;
            break;
        default:
            return '';
            break;
    }
}