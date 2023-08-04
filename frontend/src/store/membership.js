const LOAD_GROUP_MEMBERSHIPS = 'memberships/LOAD_MEMBERSHIPS';

export const loadGroupMemberships = (memberships) => ({
    type: LOAD_GROUP_MEMBERSHIPS,
    memberships,
});

export const fetchGroupMemberships = (groupId) => async (dispatch) => {
    const res = await fetch(`/api/groups/${groupId}/members`);
    if (res.ok) {
        const members = await res.json();
        dispatch(loadGroupMemberships(members));
    } else {
        const errors = await res.json();
        return errors;
    }
}

const membershipReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_GROUP_MEMBERSHIPS:
            const membershipState = {};
            action.memberships.Members.forEach((member) => {
                membershipState[member.id] = member;
            });
            return membershipState;
        default:
            return state;
    }
}

export default membershipReducer;
