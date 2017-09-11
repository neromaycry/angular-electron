/**
 * Import decorators and services from angular
 */
import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Import the ngrx configured store
 */
import { Store } from '@ngrx/store';
import { State } from '../../store/index';

import { User } from './../../store/models/auth.model';

/**
 * Import the authentication service to be injected into our component
 */
import { Authentication } from '../../services/authentication';

@Component({
    selector: 'ae-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    unsubscribe: any;
    authenticated: boolean;

    //Inject Authentication service on construction
    constructor(private _router: Router, private _ngZone: NgZone, private auth: Authentication, public store: Store<State>) { }

    ngOnInit() {
        this.checkAuth();

        this.store.map((state: State) => state.user).subscribe((userState: User) => {
            this.authenticated = userState.authenticated;
            //Because the BrowserWindow runs outside angular for some reason we need to call Zone.run()
            this._ngZone.run(() => {
                if (userState.username != '') {
                    this._router.navigate(['home']);
                }
            });
        });
    }

    /**
     * Checks for authentication
     * If existing auth in localstorage just gets the user data immediately
     */
    checkAuth() {
        let storageToken = window.localStorage.getItem('authToken');
        if (storageToken) {
            this.auth.requestUserData(storageToken);
        }
    }

    authenticate() {
        this.auth.githubHandShake();
    }
}
