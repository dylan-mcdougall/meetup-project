import { csrfFetch } from "./csrf";

const LOAD_EVENTS = 'events/LOAD_EVENTS';
const RECEIVE_EVENT = 'events/RECEIVE_EVENT';
const UPDATE_EVENT = 'events/UPDATE_EVENT';
const REMOVE_EVENT = 'events/REMOVE_EVENT';
const CREATE_EVENT = 'events/CREATE_EVENT';

const CREATE_EVENT_IMAGE = 'events/CREATE_EVENT_IMAGE';

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

export const createEvent = (event) => ({
    type: CREATE_EVENT,
    event,
})

export const createEventImage = (image) => ({
    type: CREATE_EVENT_IMAGE,
    image,
})

export const fetchEvents = () => async (dispatch) => {
    const res = await fetch('/api/events');
    const events = await res.json();

    const updatedEventsArray = await Promise.all(events.Events.map(async (event) => {
        const res = await fetch(`/api/events/${event.id}`);
        return await res.json();
    }));

    const updatedEventsObject = {
        Events: []
    };

    updatedEventsArray.forEach((event) => {
        updatedEventsObject.Events[event.id] = event;
    });

    dispatch(loadEvents(updatedEventsObject));
}

export const fetchEventDetails = (eventId) => async (dispatch) => {
    const res = await fetch(`/api/events/${eventId}`);
    if (res.ok) {
        const event = await res.json();
        dispatch(receiveEvent(event));
    } else {
        const errors = await res.json();
        return errors;
    }
}

export const createEventAction = (groupId, event) => async (dispatch) => {
    const res = await csrfFetch(`/api/groups/${groupId}/events`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(event)
    });
    if (res.ok) {
        const createdEvent = await res.json();
        dispatch(createEvent(createdEvent));
        return createdEvent;
    } else {
        const errors = await res.json();
        return errors;
    }
};

export const deleteEventAction = (eventId) => async (dispatch) => {
    const res = await csrfFetch(`/api/events/${eventId}`, { method: 'DELETE' });
    if (res.ok) {
        const confirmation = await res.json();
        dispatch(removeEvent(eventId));
        return confirmation;
    } else {
        const errors = await res.json();
        return errors;
    }
};

export const uploadEventImage = (eventId, image) => async (dispatch) => {
    const res = await csrfFetch(`/api/events/${eventId}/images`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(image)
    });
    if (res.ok) {
        const imageDetails = await res.json();
        dispatch(createEventImage(imageDetails));
        return imageDetails;
    } else {
        const errors = await res.json();
        return errors;
    }
}

const eventsReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_EVENTS:
            const eventsState = {};
            action.events.Events.forEach((event) => {
                eventsState[event.id] = event;
            });
            return eventsState
        case RECEIVE_EVENT:
            return { ...state, [action.event.id]: action.event };
        case CREATE_EVENT:
            return { ...state, [action.event.id]: action.event };
        case REMOVE_EVENT:
            const newState = { ...state };
            delete newState[action.eventId];
            return newState;
        case CREATE_EVENT_IMAGE:
            return { ...state };
        default:
            return state;
    }
}

export default eventsReducer;
