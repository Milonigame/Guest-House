=== Luviana ===
Contributors: MotoPress
Tags: custom-logo, custom-menu, featured-images, threaded-comments, translation-ready, block-styles
Requires at least: 5.0
Tested up to: 5.3
Stable tag: 1.0.0
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Luviana is a Gutenberg theme perfectly fitting for hotels, rental accommodations and services, boarding houses or hostels. The theme comprises an integrated online booking plugin that allows conducting reservations of your rental properties and receiving online payments.


== Installation ==

1. In your admin panel, go to Appearance > Themes and click the Add New button.
2. Click Upload Theme and Choose File, then select the theme's .zip file. Click Install Now. Click Activate.
3. Install required plugins.
4. If you create a new website, you may import sample data in Appearance > Import Demo Data.

== Changelog ==

= 1.2.1, Jan 15 2020 =
* Improved the front-page slideshow performance.

= 1.2.0, Jan 13 2020 =
* Added the ability to setup video as a first slide for front-page slideshow.
* Added the ability to change primary colors.
* Minor bugfixes and improvements.

= 1.1.0, Nov 18 2019 =
* Added ability to setup front-page slideshow settings in Customizer.
* Added editor styles for Hotel Booking editor blocks.
* Minor bugfixes and improvements.
* Hotel Booking plugin updated to version 3.7.1.
  * Improved blocks compatibility with the new versions of the Gutenberg editor.
  * Added customer email address to the Stripe payment details.
  * Fixed an issue where the price breakdown was not displayed in the new booking emails.
  * Fixed an issue at checkout when coupon discount was not applied to the total price at the bottom of the page.
  * Fixed a bug concerning impossibility to complete Stripe payment after applying the coupon code.
  * Fixed an issue where the type of the coupon code was changed after its use.
  * Improved the "Booking Confirmed" page with regard to displaying information on client's booking and payment in case the booking is paid online. Follow the prompts to update the content of the "Booking Confirmed" page automatically or apply the changes manually.
  * Added the new email tag, which allows guests to visit their booking details page directly from the email. Important: you need to update your email templates to start using this functionality.
  * New actions and filters were added for developers.
  * Fixed the issue at checkout when a variable price was not applied if capacity is disabled in plugin settings.
  * Added Direct Bank Transfer as a new payment gateway.
  * Added the ability to delete ical synchronization logs automatically.
  * Added new intervals for importing bookings through the ical "Quarter an Hour" and "Half an Hour".
  * The user information is no longer required while creating a booking in the admin panel. You can enable it again in the settings.
  * Added new tags for email templates: Price Breakdown, Country, State, City, Postcode, Address, Full Guest Name.
  * Added the ability to select the accommodation type while duplicating rates.
  * Improvement: now if the accommodation type size is not set, the field will not be displayed on the website.
  * Implemented bookings synchronization with Expedia travel booking website.
  * Updated PayPal and Stripe payment integrations to comply with PSD2 and the SCA requirements.
  * Added the ability to receive payments through Bancontact, iDEAL, Giropay, SEPA Direct Debit and SOFORT payment gateways via the updated Stripe API.

= 1.0, July 2019 =
* Initial release

== Credits ==

* Based on Underscores https://underscores.me/, (C) 2012-2017 Automattic, Inc., [GPLv2 or later](https://www.gnu.org/licenses/gpl-2.0.html)
* normalize.css https://necolas.github.io/normalize.css/, (C) 2012-2016 Nicolas Gallagher and Jonathan Neal, [MIT](https://opensource.org/licenses/MIT)
