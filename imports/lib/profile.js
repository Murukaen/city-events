import { Meteor } from 'meteor/meteor';

export const Profile = {
    DEV_PROFILE: "develop",
    isDev() {
        console.log(Meteor.settings);
        return Meteor.settings.public.profile == Profile.DEV_PROFILE;
    }
}