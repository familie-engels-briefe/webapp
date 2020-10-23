import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
import { getPersonName } from './persons'
import { getPlaceName } from './places'

Vue.use(Vuex)

const personDictionary = {}
const placeDictionary = {}
const doctypesDictionary = {
    'letter': 'Brief'
}

const store = new Vuex.Store({
    state: {
        loaded: false,
        letters: [],
        organisations: [],
        persons: [],
        places: [],
        doctypes: [],
        filter: {
            sender: [],
            receiver: [],
            place: [],
            doctype: []
        }
    },
    getters: {
        senders (state) {
            return _.uniqBy(state.letters.map(function (letter) {
                return {
                    id: letter.sent.person.ref.replace('#', ''),
                    text: letter.sent.person.name,
                }
            }), 'id')
        },
        receivers (state) {
            return _.uniqBy(state.letters.map(function (letter) {
                return {
                    id: letter.received.person.ref.replace('#', ''),
                    text: letter.received.person.name,
                }
            }), 'id')
        },
        places (state) {
            return _.uniqBy(state.letters.map(function (letter) {
                return {
                    id: letter.sent.place.ref.replace('#', ''),
                    text: letter.sent.place.name,
                }
            }), 'id')
        },
        doctypes () {
            return Object.keys(doctypesDictionary).map(function (id) {
                return {
                    id: id,
                    text: doctypesDictionary[id]
                }
            })
        },
        filterdLetters (state) {
            let letters = state.letters

            let filteredLetters = []

            const senders = state.filter.sender.map(function (sender) {
                return '#' + sender.id
            })

            const receivers = state.filter.receiver.map(function (receiver) {
                return '#' + receiver.id
            })

            const places = state.filter.place.map(function (place) {
                return '#' + place.id
            })

            const doctypes = state.filter.doctype.map(function (doctype) {
                return doctype.id
            })

            filteredLetters = []
            if (senders.length) {
                for (let i = 0; i < senders.length; i++) {
                    filteredLetters.push(...state.letters.filter(function (letter) {
                        return senders.indexOf(letter.sent.person.ref) !== -1
                    }))
                }
            } else {
                filteredLetters.push(...state.letters)
            }
            letters = _.uniqBy(filteredLetters, 'number')

            filteredLetters = []
            if (receivers.length) {
                for (let i = 0; i < receivers.length; i++) {
                    filteredLetters.push(...letters.filter(function (letter) {
                        return receivers.indexOf(letter.received.person.ref) !== -1
                    }))
                }
            } else {
                filteredLetters.push(...letters)
            }
            letters = _.uniqBy(filteredLetters, 'number')

            filteredLetters = []
            if (places.length) {
                for (let i = 0; i < places.length; i++) {
                    filteredLetters.push(...letters.filter(function (letter) {
                        return places.indexOf(letter.sent.place.ref) !== -1
                    }))
                }
            } else {
                filteredLetters.push(...letters)
            }
            letters = _.uniqBy(filteredLetters, 'number')

            filteredLetters = []
            if (doctypes.length) {
                for (let i = 0; i < doctypes.length; i++) {
                    filteredLetters.push(...letters.filter(function (letter) {
                        return typeof doctypesDictionary[letter.doctype] !== 'undefined'
                    }))
                }
            } else {
                filteredLetters.push(...letters)
            }
            letters = _.uniqBy(filteredLetters, 'number')

            return letters
        },
    },
    mutations: {
        setLoaded (state) {
            const loaded = (state.letters.length > 0 &&
                state.organisations.length > 0 &&
                state.persons.length > 0 &&
                state.places.length > 0)

            if (loaded) {
                // When all data is loaded

                // Get unique doctypes from letters
                state.doctypes.push(..._.uniq(state.letters.map(function (letter) {
                    return letter.doctype
                })))

                // Create dictionaries for faster access
                for (let i = 0; i < state.persons.length; i++) {
                    personDictionary[state.persons[i]['xml:id']] = state.persons[i]
                }

                for (let i = 0; i < state.places.length; i++) {
                    placeDictionary[state.places[i]['xml:id']] = state.places[i]
                }

                const letters = []

                // Set additional details for each letter
                for (let i = 0; i < state.letters.length; i++) {
                    const letter = state.letters[i]

                    // Set sender name
                    const personSend = personDictionary[state.letters[i].sent.person.ref.replace('#', '')] || {
                        'name': 'Unbekannt'
                    }
                    letter.sent.person.name = personSend.name

                    // Set receiver name
                    const personReceived = personDictionary[state.letters[i].received.person.ref.replace('#', '')] || {
                        'name': 'Unbekannt'
                    }
                    letter.received.person.name = personReceived.name

                    // Set sender place
                    const placeSend = placeDictionary[state.letters[i].sent.place.ref.replace('#', '')] || {
                        'name': 'Unbekannt'
                    }
                    letter.sent.place.name = placeSend.name

                    // Set receiver place
                    const placeReceived = placeDictionary[state.letters[i].received.place.ref.replace('#', '')] || {
                        'name': 'Unbekannt'
                    }
                    letter.received.place.name = placeReceived.name

                    // Set doctype
                    letter.doctypeName = doctypesDictionary[state.letters[i].doctype] || 'Unbekannt'

                    letters.push(letter)
                }

                Vue.set(state, 'letters', letters)

                console.debug('Data loaded')
            }

            state.loaded = loaded
        },
        setLetters (state, letters) {
            state.letters.push(...letters)
        },
        setOrganisations (state, organisations) {
            state.organisations.push(...organisations)
        },
        setPersons (state, persons) {
            persons = persons.map(function (person) {
                person.name = getPersonName(person) ?? 'Unbekannt'

                return person
            })

            state.persons.push(...persons)
        },
        setPlaces (state, places) {
            places = places.map(function (place) {
                place.name = getPlaceName(place) ?? 'Unbekannt'

                return place
            })

            state.places.push(...places)
        },
        /**
         *
         * @param state
         * @param {Object} payload
         * @param {string} payload.type
         * @param {Array} payload.tags
         */
        updateFilter (state, payload) {
            Vue.set(state.filter, payload.type, payload.tags)
        }
    }
})

export default store
