"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionStatus = exports.UserRole = exports.UserStatus = void 0;
var UserStatus;
(function (UserStatus) {
    UserStatus["PENDING"] = "PENDING";
    UserStatus["APPROVED"] = "APPROVED";
    UserStatus["REJECTED"] = "REJECTED";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["USER"] = "SISWA";
    UserRole["MENTOR"] = "MENTOR";
})(UserRole || (exports.UserRole = UserRole = {}));
var SubmissionStatus;
(function (SubmissionStatus) {
    SubmissionStatus["SUBMITTED"] = "SUBMITTED";
    SubmissionStatus["OVERDUE"] = "OVERDUE";
    SubmissionStatus["REVISED"] = "REVISED";
    SubmissionStatus["APPROVED"] = "APPROVED";
})(SubmissionStatus || (exports.SubmissionStatus = SubmissionStatus = {}));
