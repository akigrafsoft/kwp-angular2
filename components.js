exports.AuthService = require('./lib/auth/auth.service').AuthService;
exports.AuthLoginComponent = require('./lib/auth/login.component').AuthLoginComponent;
exports.AuthLogoutComponent = require('./lib/auth/logout.component').AuthLogoutComponent;
exports.AuthLogoutComponent = require('./lib/auth/role').AuthLogoutComponent;

exports.CalendarComponent = require('./lib/calendar/calendar.component').CalendarComponent;

exports.ConfigurationResolver = require('./lib/configuration/configuration.resolver').ConfigurationResolver;
exports.ConfigurationService = require('./lib/configuration/configuration.service').ConfigurationService;

exports.FileService = require('./lib/files/file.service').FileService;
exports.UploadComponent = require('./lib/files/upload.component').UploadComponent;

exports.JnlpService = require('./lib/jnlp/jnlp.service').JnlpService;

exports.GoogleplaceDirective = require('./lib/maps/googleplace.directive').GoogleplaceDirective;
exports.MapComponent = require('./lib/maps/map.component').MapComponent;

exports.MongoDBService = require('./lib/mongodb/mongodb.service').MongoDBService;
exports.MongoDBGridFSService = require('./lib/mongodb/mongodbgridfs.service').MongoDBGridFSService;

exports.PagedListDirective = require('./lib/pagedlist/pagedlist.directive').PagedListDirective;
exports.PagedListService = require('./lib/pagedlist/pagedlist.service').PagedListService;

exports.NumberFixedLenPipe = require('./lib/pipes/number-fixed-len.pipe').NumberFixedLenPipe;

exports.ActivationComponent = require('./lib/users/activation.component').ActivationComponent;
exports.ActivationService = require('./lib/users/activation.service').ActivationService;
exports.RegistrationComponent = require('./lib/users/registration.component').RegistrationComponent;
exports.UserFormComponent = require('./lib/users/user-form.component').UserFormComponent;
exports.UserService = require('./lib/users/user.service').UserService;
exports.UsersComponent = require('./lib/users/users.component').UsersComponent;

exports.NumberFixedLenPipe = require('./lib/pipes/number-fixed-len.pipe').NumberFixedLenPipe;