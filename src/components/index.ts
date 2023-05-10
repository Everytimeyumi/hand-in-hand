import { AtMessage ,AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui-vue3'
import "taro-ui-vue3/dist/style/components/modal.scss";
import "taro-ui-vue3/dist/style/components/message.scss";
const components = [
    AtMessage ,
    AtModal,
     AtModalHeader,
      AtModalContent,
       AtModalAction
];

export default {
    install: app => {
        components.forEach(component => {
            app.component( component);
        });
    }
};

