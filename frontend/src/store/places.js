export const getPlaceName = function (place) {
    try {
        return place.placeName ?? 'Unbekannt'
    } catch (e) {
        console.error('Could not get place from', place, e)
    }
}

export const getAutocompletePlaces = function () {
    return []
}
