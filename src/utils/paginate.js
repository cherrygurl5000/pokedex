import _ from 'lodash'

export function paginate(items, pageNumber, pageSize) {
    const startIndex = (pageNumber - 1) * pageSize
    // change the items array into a lodash wrapper so that we can chain the events
    return _(items).slice(startIndex).take(pageSize).value();
}