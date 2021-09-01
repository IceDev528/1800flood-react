
CREATE TABLE address(
    addressid int auto_increment primary key,
    contact varchar(100) default '',
    addressline1 varchar(100),
    addressline2 varchar(100),
    suburb varchar(50),
    state varchar(50),
    postcode varchar(10)
);

CREATE TABLE customer(
    customerid int auto_increment primary key,
    name varchar(100) default '',
    billingemail varchar(200) default '',
    phonenumber varchar(20) default '',
    billingaddressid int references address(addressid)
);

CREATE TABLE `user`(
    userid int auto_increment primary key,
    email varchar(100),
    password varchar(100),
    firstname varchar(100),
    lastname varchar(100),
    mobile varchar(15),
    verificationcode varchar(6),
    isactive bit default true,
    customerid int default null references customer(customerid)
);

CREATE TABLE job (
    jobid int auto_increment primary key,
    jobnumber int auto_increment default 300001,
    jobstatus varchar(20) default 'OPEN',
    jobtype varchar(10) default 'QUOTE',
    category varchar(20) default 'Category 1',
    class varchar(10) default 'Calss 1',
    billingaddressid int default null references address(addressid),
    propertyaddressid int default null references address(addressid),
    progress decimal(10,2) default 0.0,
    isSP bit default false,
    DateOfLoss DateTime default now(),
    FirstNoticeOfLoss Datetime default now(),
    arrivaldatetime datetime default now(),
    departuredatetime datetime default now(),
    waterextracted int default 0,
    paymentmethodid int references paymentmethod(paymentmethodid),
    customerid int references customer(customerid),
    estimate decimal(10, 2) default 0.0,
    pmhours int default 0,
    techhours int default 0,
    supervisorhours int default 0
);

CREATE TABLE bill(
    billid int auto_increment primary key,
    jobid int references job(jobid),
    customerid int references customer(customerid),
    pdflocation varchar(200),
    isemailsent bit default false    
);

CREATE TABLE settings(
    settingid int auto_increment primary key,
    name varchar(200),
    value decimal(10,2) default 0.00,
    `order` int default 0
);

CREATE TABLE billitem(
    billitemid int auto_increment primary key,
    name varchar(200),
    qty int,
    amount decimal(10,2),
    `order` int,
    jobid int references job(jobid),
    isboolean bit default false
);


CREATE TABLE area (
    areaid int auto_increment primary key,
    name varchar(200),
    jobid int references job(jobid),
    progress decimal(10,2) default 0.0,
    goal decimal(10,2) default 0.0,
    airmovers int default 0,
    dehumidifer int default 0,
    afd int default 0,
    decomissiondate datetime default now()
);

CREATE TABLE wrttech(
    wrttechid int auto_increment primary key,
    name varchar(50),
    mobile varchar(10),
    jobid int references job(jobid)
);

CREATE TABLE jobprogress(
    jobprogressid int auto_increment primary key,
    jobid int references job(jobid),
    progress decimal(10,2),
    `order` int,
    datereceived datetime default null,
    paymentref varchar(100) default null,
    amount decimal(10, 2) default 0
);

CREATE TABLE paymentmethod(
    paymentmethodid int auto_increment primary key,
    name varchar(100)
);

CREATE TABLE image(
    imageid int auto_increment primary key,
    jobid int references job(jobid),
    name varchar(200),
    location varchar(200),
    areaid int references area(areaid),
    createddate datetime default now()
);

CREATE TABLE settings(
    settingid int auto_increment primary key,
    name varchar(200),
    value decimal(10,2) default 0.00,
    `order` int default 0
);

CREATE TABLE channel(
    channelid int auto_increment primary key,
    name varchar(100),
    admin int references user(userid),
    userid int references user(userid),
    createddate datetime default now()
);

CREATE TABLE message(
    messageid int auto_increment primary key,
    userid int references user(userid),
    channelid int references channel(channelid),
    message varchar(4000) default '',
    createddate datetime default now()
);

CREATE TABLE psychometric(
    psychometricid int auto_increment primary key,
    areaid int references area(areaid),
    progress int default 0,
    hour varchar(10),
    createddate datetime default now()
);

INSERT INTO `settings` (`name`, `value`, `order`) VALUES ('Emergency Call Out Fees - Normal Business Hours', 200.00,1);
INSERT INTO `settings` (`name`, `value`, `order`) VALUES('Flood Restoration Risk Assessment Report', 200.00,2);
INSERT INTO `settings` (`name`, `value`, `order`) VALUES('IICRC Flood Restoration + Disaster Recovery + Water damage scope work', 200.00,3);
INSERT INTO `settings` (`name`, `value`, `order`) VALUES('IICRC Thermographer Assessment', 200.00,4);
INSERT INTO `settings` (`name`, `value`, `order`) VALUES('IICRC S-500 Project Manager - Normal Business Hours Rate (per hour)', 200.00,5);
INSERT INTO `settings` (`name`, `value`, `order`) VALUES('IICRC S-500 Supervisor - Normal Business Hours Rate (per hour)', 200.00,6);
INSERT INTO `settings` (`name`, `value`, `order`) VALUES('IICRC S-500 Technician - Normal Business Hours Rate (per hour)', 200.00,7);
INSERT INTO `settings` (`name`, `value`, `order`) VALUES('Air Movers Equipment (per day)', 200.00,8);
INSERT INTO `settings` (`name`, `value`, `order`) VALUES('Dehumidifier Equipment (per day)', 200.00,9);
INSERT INTO `settings` (`name`, `value`, `order`) VALUES('HEPA / AFD Equipment (per day)', 200.00,10);
INSERT INTO `settings` (`name`, `value`, `order`) VALUES('Waterextration Truck Mount (per liter)', 200.00,11);
INSERT INTO `settings` (`name`, `value`, `order`) VALUES('Flood Restoration Anti-Microbial Anti Browning Treatment and Deodorising & Sanitiser carpet (per sqm) ', 200.00,12);
INSERT INTO `settings` (`name`, `value`, `order`) VALUES('Restoration Drying Psychometric Daily Data Log (per day)', 200.00,13);

-- INSERT INTO settings(
--     mailgun_api,
--     mailgun_template,
--     call_out_fees,
--     risk_assessment_report,
--     water_damage_scope_work,
--     thermographer_assessment,
--     projectmanagement_per_hour,
--     supervisor_per_hour,
--     technician_per_hour,
--     air_movers_per_day,
--     dehumidifer_per_day,
--     afd_per_day,
--     water_extraction_truckmount_per_liter,
--     microbial_treatment_per_sqm,
--     data_log_testing_per_day
-- ) values (
--     '',
--     '',
--     222.28,
--     176.83,
--     221.96,
--     166.32,
--     102.88,
--     86.23,
--     66.92,
--     61.89,
--     126.27,
--     126.27,
--     3.78,
--     2.78,
--     102.88
-- );
insert address(addressline1, addressline2, suburb, state, postcode) values ('1 George St','','Sydney','NSW','2000');
insert customer(`name`, billingaddressid) values ('1800 Flood Sydney', 1);