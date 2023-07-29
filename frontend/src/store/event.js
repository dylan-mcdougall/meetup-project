const LOAD_EVENTS = 'events/LOAD_EVENTS';
const RECEIVE_EVENT = 'events/RECEIVE_GROUP';
const UPDATE_EVENT = 'events/UPDATE_EVENT';
const REMOVE_EVENT = 'events/REMOVE_EVENT';

export const loadEvents = (events) => ({
    type: LOAD_EVENTS,
    events,
});

export const receiveEvent = (event) => ({
    type: RECEIVE_EVENT,
    event,
});

export const updateEvent = (event) => ({
    type: UPDATE_EVENT,
    event,
});

export const removeEvent = (eventId) => ({
    type: REMOVE_EVENT,
    eventId,
});

export const fetchEvents = () => async (dispatch) => {
    const res = await fetch('/api/events');
    const events = await res.json();
    dispatch(loadEvents(events));
}

const eventsReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_EVENTS:
            const eventsState = {};
            action.events.Events.forEach((event) => {
                eventsState[event.id] = event;
            });
            return eventsState
        default:
            return state;
    }
}

export default eventsReducer;
