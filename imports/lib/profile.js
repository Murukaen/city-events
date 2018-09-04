import { Meteor } from 'meteor/meteor';

export const Profile = {
    DEV_PROFILE: "develop",
    isDev() {
        return Meteor.settings.public.profile == Profile.DEV_PROFILE;
    }
}