interface CommonDictionary {
	home: string
	dashboard: string
	profile: string
	settings: string
	logout: string
	language: string
	toggleTheme: string
	toggleLanguage: string
	scrollToTop: string
	user: string
	anonymous: string
}

interface NavigationDictionary {
	back: string
	next: string
	cancel: string
	save: string
	delete: string
	edit: string
}

interface LandingDictionary {
	latestBadge: string
	discoverTitle: string
	discoverDescription: string
	recentTitle: string
	recentDescription: string
	noQuotes: string
	startCreating: string
	ctaTitle: string
	ctaDescription: string
	getStarted: string
	learnMore: string
	exploreQuotes: string
	featureSaveTitle: string
	featureSaveDesc: string
	featureOrganizeTitle: string
	featureOrganizeDesc: string
	featureShareTitle: string
	featureShareDesc: string
	communityEyebrow: string
}

interface AddQuoteDictionary {
	addButton: string
	title: string
	description: string
	quoteLabel: string
	authorLabel: string
	sourceLabel: string
	sourceHelp: string
	tagsLabel: string
	tagsAdd: string
	tagsPlaceholder: string
	quotePlaceholder: string
	authorPlaceholder: string
	sourcePlaceholder: string
	cancel: string
	creating: string
	saveQuote: string
	errorFill: string
	errorCreate: string
	successCreated: string
	errorUnexpected: string
	removeTag: string
}

interface DashboardDictionary {
	editQuote: string
	deleteQuote: string
	quotesCollected: string
	publicQuotes: string
	yourQuotes: string
	manageCollection: string
	collection: string
}

interface DashboardEmptyDictionary {
	noQuotesTitle: string
	noQuotesDescription: string
	startBuilding: string
}

interface EditQuoteDictionary {
	title: string
	description: string
	quoteLabel: string
	authorLabel: string
	sourceLabel: string
	isPublicLabel: string
	isPublicHelp: string
	sourceHelp: string
	tagsLabel: string
	tagsAdd: string
	tagsPlaceholder: string
	quotePlaceholder: string
	authorPlaceholder: string
	sourcePlaceholder: string
	cancel: string
	updating: string
	saveChanges: string
	errorFill: string
	successUpdated: string
	unexpected: string
	removeTag: string
}

interface DeleteQuoteDictionary {
	title: string
	description: string
	cancel: string
	deleting: string
	deleteAction: string
	successDeleted: string
	errorDelete: string
	unexpected: string
}

interface HtmlToImageDictionary {
	sharedBy: string
}

interface ErrorsDictionary {
	dashboardTitle: string
	dashboardDescription: string
	tryAgain: string
	somethingWrong: string
	processingError: string
	mustBeLoggedIn: string
	invalidFields: string
	maxTags: string
	alreadyExists: string
	failedCreate: string
	failedDelete: string
	failedUpdate: string
	invalidId: string
	quoteNotFound: string
	noPermission: string
	couldNotFindElement: string
	downloadSuccess: string
	downloadFailed: string
	downloading: string
	downloadQuote: string
}

interface NotFoundDictionary {
	dashboardMissing: string
	pageTitle: string
	pageDescription: string
	home: string
}

interface FooterDictionary {
	followUs: string
	navigation: string
	home: string
	dashboard: string
	privacy: string
	terms: string
	tagline: string
	brandDescription: string
	builtWithCare: string
}

interface AuthDictionary {
	emailPlaceholder: string
	passwordPlaceholder: string
	signIn: string
	signOut: string
	signInTitle: string
	signInDescription: string
}

interface AuthErrorsDictionary {
	invalidCredentials: string
	authFailed: string
	signinError: string
	unexpected: string
	failed: string
}

interface BrandingDictionary {
	name: string
	description: string
}

interface StatusDictionary {
	public: string
	private: string
}

export interface Dictionary {
	common: CommonDictionary
	navigation: NavigationDictionary
	landing: LandingDictionary
	addQuote: AddQuoteDictionary
	dashboard: DashboardDictionary
	dashboardEmpty: DashboardEmptyDictionary
	editQuote: EditQuoteDictionary
	deleteQuote: DeleteQuoteDictionary
	htmlToImage: HtmlToImageDictionary
	errors: ErrorsDictionary
	notFound: NotFoundDictionary
	footer: FooterDictionary
	auth: AuthDictionary
	authErrors: AuthErrorsDictionary
	branding: BrandingDictionary
	status: StatusDictionary
}
