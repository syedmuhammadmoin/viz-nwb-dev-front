// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
// Translate

// title
import { Title } from '@angular/platform-browser';

import { TranslateService } from '@ngx-translate/core';
// Store
import { Store } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
// Auth
import { AuthNoticeService, AuthService, Login, User, UserLoaded } from '../../../../core/auth';
import { DecodeTokenService } from "../../../shared/decode-token.service";
import { LayoutUtilsService } from "../../../../core/_base/crud";
import { DynamicColorChangeService } from 'src/app/views/shared/services/dynamic-color/dynamic-color-change.service';
import { AppConst } from 'src/app/views/shared/AppConst';
/**
 * ! Just example => Should be removed in development
 */
const DEMO_PARAMS = {
	// EMAIL: 'superadmin@vizalys.com',
	// PASSWORD: 'Admin123!@#'
	EMAIL: '',
	PASSWORD: ''
};

@Component({
	selector: 'kt-login',
	templateUrl: './login.component.html',
	encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, OnDestroy {
	// Public params
	loginForm: FormGroup;
	loading = false;
	isLoggedIn$: Observable<boolean>;
	errors: any = [];
	user: User = new User();
	edinfini: boolean;
	sbbu: boolean;
	vizalys: boolean;
	localsto: any;
	chacklocalstorage: any = '';

	globalcolor_localStorage: any = '';
	globalcolor_sessionStorage: any = '';

	favIcon: HTMLLinkElement = document.querySelector('#favIcon');


	private unsubscribe: Subject<any>;

	private returnUrl: any;

	public onlineClient: any = [];


	// Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

	/**
	 * Component constructor
	 *
	 * @param router: Router
	 * @param auth: AuthService
	 * @param authNoticeService: AuthNoticeService
	 * @param translate: TranslateService
	 * @param store: Store<AppState>
	 * @param fb: FormBuilder
	 * @param cdr
	 * @param route
	 */
	constructor(
		private router: Router,
		private auth: AuthService,
		private authNoticeService: AuthNoticeService,
		private translate: TranslateService,
		private store: Store<AppState>,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
		private route: ActivatedRoute,
		private decodeService: DecodeTokenService,
		private layoutUtilService: LayoutUtilsService,
		public dynamicColorChanging: DynamicColorChangeService,
		private ref: ChangeDetectorRef,
		private title: Title,
	) {
		this.unsubscribe = new Subject();
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	public currentClient: any = {}
	edinfinitheming: any = '';
	sbbutheming: any = '';
	vizalystheming: any = '';
	ngOnInit(): void {
		// this.currentClient = AppConst.ClientConfig.config
		// this.changeColor();
		
		this.initLoginForm();


		// redirect back to the returnUrl before login
		this.route.queryParams.subscribe(params => {
			this.returnUrl = params.returnUrl || '/';
		});

		this.dynamicColorChanging.global_color.subscribe((res: any) => {
			this.chacklocalstorage = localStorage.getItem('global_color');
			if (this.chacklocalstorage) {
				//   this.globalcolor_sessionStorage = JSON.parse(sessionStorage.getItem('global_color'))

				this.globalcolor_localStorage = JSON.parse(localStorage.getItem('global_color'))

				document.documentElement.style.setProperty('--bg_gradient_color_one', this.globalcolor_localStorage.bg_gradient_color_one)

				document.documentElement.style.setProperty('--bg_gradient_color_two', this.globalcolor_localStorage.bg_gradient_color_two)

				document.documentElement.style.setProperty('--bg_white', this.globalcolor_localStorage.bg_white)

				document.documentElement.style.setProperty('--primary_color', this.globalcolor_localStorage.primary_color)

				document.documentElement.style.setProperty('--secondary_color', this.globalcolor_localStorage.secondary_color)

				document.documentElement.style.setProperty('--input_filed_primary_color', this.globalcolor_localStorage.input_filed_primary_color)

				document.documentElement.style.setProperty('--input_filed_background_color', this.globalcolor_localStorage.input_filed_background_color)

				document.documentElement.style.setProperty('--input_filed_border_color', this.globalcolor_localStorage.input_filed_border_color)

				document.documentElement.style.setProperty('--form_border_color', this.globalcolor_localStorage.form_border_color)

				document.documentElement.style.setProperty('--test_shadow_color', this.globalcolor_localStorage.test_shadow_color)

				document.documentElement.style.setProperty('--button_background_color', this.globalcolor_localStorage.button_background_color)

				document.documentElement.style.setProperty('--button_background_color', this.globalcolor_localStorage.button_background_color)

				document.documentElement.style.setProperty('--light_gray_color', this.globalcolor_localStorage.light_gray_color)

				document.documentElement.style.setProperty('--title', this.globalcolor_localStorage.title)

				document.documentElement.style.setProperty('--login_title', this.globalcolor_localStorage.login_title)

				document.documentElement.style.setProperty('--login_title', this.globalcolor_localStorage.login_title)

				document.documentElement.style.setProperty('--login_cover_image', this.globalcolor_localStorage.login_cover_image)

				document.documentElement.style.setProperty('--site_logo', this.globalcolor_localStorage.site_logo)
				document.documentElement.style.setProperty('--print_logo' ,this.globalcolor_localStorage.print_logo)
				document.documentElement.style.setProperty('--dashboard_hight', this.globalcolor_localStorage.dashboard_hight)

				document.documentElement.style.setProperty('--dashboard_logo_width', this.globalcolor_localStorage.dashboard_logo_width)

				document.documentElement.style.setProperty('--dashboard_logo_hight', this.globalcolor_localStorage.dashboard_logo_hight)

				document.documentElement.style.setProperty('--edinfini_true', this.globalcolor_localStorage.edinfini_true)

				document.documentElement.style.setProperty('--nawabshah_true', this.globalcolor_localStorage.nawabshah_true)

				document.documentElement.style.setProperty('--vizalys_true', this.globalcolor_localStorage.vizalys_true)

				this.title.setTitle(this.globalcolor_localStorage.site_title)
				this.favIcon.href = (this.globalcolor_localStorage.fav_icon)

			}

			else {
				localStorage.setItem('global_color', JSON.stringify(res))

				this.globalcolor_localStorage = JSON.parse(localStorage.getItem('global_color'))

				document.documentElement.style.setProperty('--bg_gradient_color_one', this.globalcolor_localStorage.bg_gradient_color_one)

				document.documentElement.style.setProperty('--bg_gradient_color_two', this.globalcolor_localStorage.bg_gradient_color_two)

				document.documentElement.style.setProperty('--bg_white', this.globalcolor_localStorage.bg_white)

				document.documentElement.style.setProperty('--primary_color', this.globalcolor_localStorage.primary_color)

				document.documentElement.style.setProperty('--secondary_color', this.globalcolor_localStorage.secondary_color)

				document.documentElement.style.setProperty('--input_filed_primary_color', this.globalcolor_localStorage.input_filed_primary_color)

				document.documentElement.style.setProperty('--input_filed_background_color', this.globalcolor_localStorage.input_filed_background_color)

				document.documentElement.style.setProperty('--input_filed_border_color', this.globalcolor_localStorage.input_filed_border_color)

				document.documentElement.style.setProperty('--form_border_color', this.globalcolor_localStorage.form_border_color)

				document.documentElement.style.setProperty('--test_shadow_color', this.globalcolor_localStorage.test_shadow_color)

				document.documentElement.style.setProperty('--button_background_color', this.globalcolor_localStorage.button_background_color)

				document.documentElement.style.setProperty('--light_gray_color', this.globalcolor_localStorage.light_gray_color)

				document.documentElement.style.setProperty('--toggler_arrow_color', this.globalcolor_localStorage.toggler_arrow_color)

				document.documentElement.style.setProperty('--home_logo_bg', this.globalcolor_localStorage.home_logo_bg)

				document.documentElement.style.setProperty('--db_dd_t_c', this.globalcolor_localStorage.db_dd_t_c)

				document.documentElement.style.setProperty('--title', this.globalcolor_localStorage.title)

				document.documentElement.style.setProperty('--login_title', this.globalcolor_localStorage.login_title)

				document.documentElement.style.setProperty('--login_cover_image', this.globalcolor_localStorage.login_cover_image)

				document.documentElement.style.setProperty('--site_logo', this.globalcolor_localStorage.site_logo)
				document.documentElement.style.setProperty('--print_logo' ,this.globalcolor_localStorage.print_logo)
				document.documentElement.style.setProperty('--dashboard_hight', this.globalcolor_localStorage.dashboard_hight)

				document.documentElement.style.setProperty('--dashboard_logo_width', this.globalcolor_localStorage.dashboard_logo_width)

				document.documentElement.style.setProperty('--dashboard_logo_hight', this.globalcolor_localStorage.dashboard_logo_width)

				document.documentElement.style.setProperty('--chart_color', this.globalcolor_localStorage.chart_color)

				document.documentElement.style.setProperty('--site_title', this.globalcolor_localStorage.site_title)

				document.documentElement.style.setProperty('--fav_icon', this.globalcolor_localStorage.fav_icon)

				document.documentElement.style.setProperty('--edinfini_true', this.globalcolor_localStorage.edinfini_true)
				document.documentElement.style.setProperty('--nawabshah_true', this.globalcolor_localStorage.nawabshah_true)
				document.documentElement.style.setProperty('--vizalys_true', this.globalcolor_localStorage.vizalys_true)

				this.title.setTitle(this.globalcolor_localStorage.site_title)
				this.favIcon.href = (this.globalcolor_localStorage.fav_icon)

			}
		})

		this.dynamicColorChanging.global_color.subscribe((res: any) => {

			if (localStorage.getItem('global_color')) {
				this.localsto = JSON.parse(localStorage.getItem('global_color'))
				this.edinfini = this.localsto.edinfini_true;
				this.sbbu = this.localsto.nawabshah_true;
				this.vizalys = this.localsto.vizalys_true;
			}
			else {
				this.localsto = res;
				this.edinfini = this.localsto.edinfini_true;
				this.sbbu = this.localsto.nawabshah_true;
				this.vizalys = this.localsto.vizalys_true;
			}

			this.ref.detectChanges()
		})
	}

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		this.authNoticeService.setNotice(null);
		this.unsubscribe.next(null);
		this.unsubscribe.complete();
		this.loading = false;
	}

	/**
	 * Form initalization
	 * Default params, validators
	 */
	initLoginForm() {
		// demo message to show
		if (!this.authNoticeService.onNoticeChanged$.getValue()) {
			const initialNotice = `Use account
			<strong>${DEMO_PARAMS.EMAIL}</strong> and password
			<strong>${DEMO_PARAMS.PASSWORD}</strong> to continue.`;
			// this.authNoticeService.setNotice(initialNotice, 'info');
		}

		this.loginForm = this.fb.group({
			email: [DEMO_PARAMS.EMAIL, Validators.compose([
				Validators.required,
				// Validators.email,
				// Validators.minLength(3),
				// Validators.maxLength(320) // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
			])
			],
			password: [DEMO_PARAMS.PASSWORD, Validators.compose([
				Validators.required,
				// Validators.minLength(3),
				// Validators.maxLength(100)
			])
			]
		});
	}

	/**
	 * Form Submit
	 */
	async submit() {
		const controls = this.loginForm.controls;
		/** check form */
		if (this.loginForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		this.loading = true;

		const authData = {
			email: controls.email.value,
			password: controls.password.value
		};
		this.auth
			.login(authData.email, authData.password)
			.pipe(
				tap(async res => {
					if (res.isSuccess) {
						this.store.dispatch(new Login({ authToken: res.message }));
						const decodedToken = await this.decodeService.decode(res.message);
						this.store.dispatch(new UserLoaded({ user: this.decodeService.setUser(decodedToken) }));
						await this.router.navigateByUrl(this.returnUrl); // Main page
					}
				}),
				takeUntil(this.unsubscribe),
				finalize(() => {
					this.loading = false;
					this.cdr.markForCheck();
				})
			)
			.subscribe(
				() => { });
	}

	/**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.loginForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}




	// changeColor() {
	// 	debugger;
	// 	console.log("Neechay",this.currentClient);
	// 	localStorage.setItem('global_color', JSON.stringify(this.currentClient));
	// 	this.dynamicColorChanging.global_color.next(this.currentClient);
	// }
}