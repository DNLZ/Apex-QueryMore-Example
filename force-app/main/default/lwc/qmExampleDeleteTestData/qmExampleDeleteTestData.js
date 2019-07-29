/**
 * Interface to remove test data (Accounts)
 */

import {LightningElement, track, wire} from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import deleteTestData from '@salesforce/apex/QM_Example_LWC_DeleteTestDataController.deleteTestData';
import {fireEvent} from "c/pubsub";

export default class QmExampleDeleteTestData extends LightningElement {
    @wire(CurrentPageReference) pageRef; // for pubsub

    @track loading = false;

    handleDeleteAllTestDataButtonPress() {
        this.loading = true;
        deleteTestData().then(() => {
            this.loading = false;
            this._fireDataChangeEvent();
        });
    }

    _fireDataChangeEvent() {
        fireEvent(this.pageRef, 'qm__testDataChange', {});
    }
}