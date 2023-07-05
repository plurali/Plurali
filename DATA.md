
# Addressing user data a.k.a Data Transparency

Plurali ("the service", available at https://plurali.icu) is for most of it's information using data from Simply Plural ("SP"). However, in order to add custom functionality or even some basic states (eg. visibility), some data is collected by the service. This data is and won't be used for any other purpose than the actual functionality of the service. Here's a thorough explanation of what the service collects, why and for how long.

## Legend

- Irreversible hash - Usually in context of passwords, a hash is an output of an irreversible (to sane doubt) cryptographic alogritm. In practice, this means that the input (eg. an account password) cannot be read from this hash, or anyhow derived (again, with sane doubt; with the exception of [brute-forcing](https://en.wikipedia.org/wiki/Brute-force_attack)). The hash can, however, be used to verify whether a value is equal to the original input, for example, the hash can be used to checked whether a password entered in a login form matches your actual account password (by verifying it against the hash of your actual account password).

- API - Application Programming Interface - a way for applications to interact with or receive data from one another. For example, the service uses the SP API to get your system and their member's data.
- API calls - a process of requesting data from an API

## What data does the service store?

Upon creating an account on the service, no data is stored on the server, the service does not track you or your actions on it. The service may store functionality-related cookies related to actual functionality, however no data is saved by us, certainly not to the extent of uniquely identifying your real identity (which applies to registered users as well).

### From the moment you register on the service, the service stores the following:

- Your account's username & password (password being saved in form of an irreversible hash) on the service,
- the account's system visibility is saved as false by default,
- when provided, your Simply Plural API key ("Plural key").

### Upon providing the plural key (and each time you provide a new key), the service stores the following:

- An indexed summary of the system connected to said key is persisted (see section "Indexed data"),
- visibility for each member is by default,
- raw responses from calls to SP's API (system and it's member list, including custom fields & their values for each member) are cached - see section "Cached data".

## Indexed data

When reaching to SP, in order to connect our data and SP's (eg. preferences for a member and the actual SP member), the service needs to index minimal amount of information from your SP account.

### When the service indexes your SP account, the service stores the following about it's entities (system and each member):
- Each member's unique ID (in dashboard visible as SID, system's ID is not preserved as it's bound to the Plural key),
- a [URL slug](https://www.semrush.com/blog/what-is-a-url-slug/) (eg. alPj0-example-system) for the system and it's members - unlike the rest of the data, the slug is immutable, therefore if you change the system/member's name in SP, it won't project in the public URL (eg. https://plurali.icu/alPj0-system-name will stay the same even when the system is not named "Example System" anymore),
- visbility on Plurali - for each entity set to public if they are public in SP (SP's trusted friends don't count), false otherwise. This is decided only when the entity is new to us (newly added member), it won't be in sync with SP's visibility afterwards during any future indexing.

When a member does not exist anymore, any information about them should be erased when your SP account is indexed again.

### How often is your SP account indexed?

Every time you login to the dashboard or save account settings. If an entity (=system/member) is not visible in the dashboard or on the public view, it's because it has not yet been properly indexed (adding a new member to SP). If the member does exist but some of the data from SP is outdated, it's not an indexing-related issue, see "Cached data".

## Cached data

Calling the SP API each time a system and/or it's member is requested (not just in the dashboard, but on public pages as well) is very inefficient for both us and SP, requiring a lot of network bandwith (at bigger scale), not to mention slow response time of the service. In order to mitigate that, the service caches (=temporarily saves) the data SP's API returns (system and it's members, including custom fields with values for each member). The cached data is saved for 5 minutes (unless specified otherwiese) and then deleted. It only gets cached again if there is any interaction with your account - entering the dashboard or visiting the public view.

## Requesting deletion of data

As per the EU regulations, a user is entitled for complete deletion of their account (and all of it's associated data), if you wish to delete your account, you can request it via email at valisova@lilianaa.dev.

<hr>

Last updated at April 9, 2023 by @lilianalillyy
