import { csrfFetch } from "./csrf";

const LOAD_GROUPS = 'groups/LOAD_GROUPS';
const RECEIVE_GROUP = 'groups/RECEIVE_GROUP';
const UPDATE_GROUP = 'groups/UPDATE_GROUP';
const REMOVE_GROUP = 'groups/REMOVE_GROUP';
const CREATE_GROUP = 'groups/CREATE_GROUP';

const CREATE_GROUP_IMAGE = 'groups/CREATE_GROUP_IMAGE';


export const loadGroups = (groups) => ({
    type: LOAD_GROUPS,
    groups,
});

export const receiveGroup = (group) => ({
    type: RECEIVE_GROUP,
    group,
});

export const updateGroup = (group) => ({
    type: UPDATE_GROUP,
    group,
});

export const removeGroup = (groupId) => ({
    type: REMOVE_GROUP,
    groupId,
});

export const createGroup = (group) => ({
    type: CREATE_GROUP,
    group,
})

// export const createGroupImage = (groupId, image) => ({
//     type: CREATE_GROUP_IMAGE,
//     groupId,
//     image,
// })



export const fetchGroups = () => async (dispatch) => {
    const res = await fetch('/api/groups');
    const groups = await res.json();

    const updatedGroupsArray = await Promise.all(groups.Groups.map(async (group) => {
        const res = await fetch(`/api/groups/${group.id}/events`);
        group.Events = await res.json();
        return group;
    }));

    const updatedGroupsObject = {
        Groups: []
    };

    updatedGroupsArray.forEach((group) => {
        updatedGroupsObject.Groups[group.id] = group;
    });

    dispatch(loadGroups(updatedGroupsObject));
}

export const fetchGroupDetails = (groupId) => async (dispatch) => {
    const res = await fetch(`/api/groups/${groupId}`);
    const events = await fetch(`/api/groups/${groupId}/events`);
    if (res.ok && events.ok) {
        const groupDetails = await res.json();
        const eventDetails = await events.json();

        const detailedEvents = await Promise.all(eventDetails.Events.map(async event => {
            const eventDetailRes = await fetch(`/api/events/${event.id}`);
            if (eventDetailRes.ok) {
                const details = await eventDetailRes.json();
                return details;
            } else {
                const errors = await eventDetailRes.json();
                return errors;
            }
        }));

        groupDetails.Events = detailedEvents;
        dispatch(receiveGroup(groupDetails));
    } else {
        const errors = await res.json();
        return errors;
    }
}

export const createGroupAction = (group) => async (dispatch) => {
    const res = await csrfFetch('/api/groups', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(group)
    });
    if (res.ok) {
        const createdGroup = await res.json();
        dispatch(createGroup(createdGroup));
        return createdGroup;
    } else {
        const errors = await res.json();
        return errors;
    }
};

export const updateGroupAction = (groupId, group) => async (dispatch) => {
    const res = await csrfFetch(`/api/groups/${(groupId).toString()}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(group)
    });
    if (res.ok) {
        const updatedGroup = await res.json();
        dispatch(updateGroup(updatedGroup));
        return updatedGroup;
    } else {
        const errors = await res.json();
        return errors;
    }
};

export const deleteGroupAction = (groupId) => async (dispatch) => {
    const res = await csrfFetch(`/api/groups/${groupId}`, { method: 'DELETE' });
    if (res.ok) {
        const confirmation = await res.json();
        dispatch(removeGroup(groupId));
        return confirmation;
    } else {
        const errors = await res.json();
        return errors;
    }
};

// export const uploadGroupImage = (groupId, image) => async (dispatch) => {
//     const res = await csrfFetch(`/api/groups/${groupId}/images`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(image)
//     });
//     if (res.ok) {
//         const imageDetails = await res.json();
//         console.log(imageDetails);
//         dispatch(createGroupImage(imageDetails));
//         return imageDetails;
//     } else {
//         const errors = await res.json();
//         return errors;
//     }
// }


const groupsReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_GROUPS:
            const groupsState = {};
            action.groups.Groups.forEach((group) => {
                groupsState[group.id] = group;
            });
            return groupsState;
        case RECEIVE_GROUP:
            if (action.group) {
                const newState = { ...state };
                newState[action.group.id] = action.group
                return newState;
            } else {
                return state;
            }
        case CREATE_GROUP:
            return { ...state, [action.group.id]: action.group };
        case UPDATE_GROUP:
            return { ...state, [action.group.id]: action.group };
        case REMOVE_GROUP:
            const newState = { ...state };
            delete newState[action.groupId];
            return newState;
        case CREATE_GROUP_IMAGE:
            return { ...state };
        default:
            return state;
    }
}

export default groupsReducer;
