// var jade = require('jade');

// var fn = jade.compileFile('interactive.jade', 
// 			{
// 				pretty:true
// 			}) ;

// console.log(fn({
// 	numbr:4
// })) ;


var gulp = require('gulp') ,
	through2 = require('through2'), //https://github.com/rvagg/through2
	fs = require('fs'),
	path = require('path') ,

	//
	jade = require('gulp-jade') ,
	sass = require('gulp-sass'),	

	//
	insert = require('gulp-file-insert'),
	pre = require('gulp-preprocess') ,
	replace = require('gulp-replace')

	// email modules
	decorate = require('../modules/decorator.js')

	;

				

//////////////////////
//
//////////////////////


gulp.task('interactive-generator', function() {

	var filepath = 'images/' ;
	var fullfiles = [] ;

	fs.readdir(filepath, function(err, files){
		
		files.forEach(function(file){
			if(file=='.DS_Store') return ;
			fullfiles.push( 'url('+path.resolve(filepath,file)+')' )
		})



		//////////////////////
		// jade generation
		//////////////////////


		var htmlStream = gulp.src('interactive.jade')

		.pipe(
			jade({
				pretty: true,
				locals: {
					numbr: fullfiles.length,
					names: fullfiles					
					}
				}
			))

			.pipe(
				through2.obj(
					decorate
				))
			;


		//console.log(interactiveStream)
		htmlStream.pipe(gulp.dest('./dist/')) ;


		//


		//////////////////////
		// sass generation
		//////////////////////


		// GULP PROCESS IN CALLBACK
		var cssStream = gulp.src('interactive.scss')

		.pipe(
			pre({ 
				context:{
					FRAMES:fullfiles.length,
					NAMES: fullfiles
					} 
				}
			))

		.pipe(sass()) 
		;

		 cssStream.pipe(gulp.dest('./dist/')) ;	

	});



});



//////////////////////
//  Gulp Insert
//////////////////////



var insertFiles ={
	'/** INPUT CSS **/':'./dist/interactive.css',
	//'<!--CREATIVE-INPUT-->':'./dist/interactive.html',	
	'<!--CREATIVE-INPUT-->':'./dist/partial-interactive-content.html',	
}



//////////////////////
//  Gulp Replace
//////////////////////



// ampscript redirects

function buildRedirect(sub){
	var subdomain = sub? sub : '';
	return '"%%=RedirectTo(CONCAT('+ "'http://',@SUBDOMAIN," + "'.burberry.com/" + subdomain+"'" + '))=%%"' ;
}



gulp.task('insert', function() {

	gulp.src('structure.html')

	.pipe(
		through2.obj(
			decorate
		))


	// gulp-insert  js and css files 
	.pipe( insert(insertFiles) )

	// gulp-replace ampscript variables
	.pipe(replace(
		'"@@redirect-base"', buildRedirect()
		))

	.pipe(replace(
		'"@@redirect-shipping"', buildRedirect('customer-service/shipping/')
		))	

	.pipe(replace(
		'"@@redirect-locator"', buildRedirect('store-locator/')
		))

	.pipe(replace(
		'"@@redirect-product"', buildRedirect('womens-coats-jackets/')
		))	

	.pipe(replace(
		'"@@redirect-cta-1"', buildRedirect('womens-coats/')
		))

	.pipe(replace(
		'"@@redirect-cta-2"', buildRedirect('womens-bags/')
		))

	// title 

	.pipe(replace(
		'"@@alt-image"', '"%%=v(@BURBERRY_ALT_IMAGE)=%%"'
		))												

	.pipe(gulp.dest('./dist/')) ;
});




gulp.task('wrap-interactive', function() {

	gulp.src('partial-interactive-content.html')

	.pipe(
		through2.obj(
			decorate
		))

	// gulp-insert  js and css files 

	.pipe( insert({
		'<!--CREATIVE-INPUT-->':'./dist/interactive.html',
	}) )

	.pipe(gulp.dest('./dist/')) ;
});






gulp.task('basic', function() {

	gulp.src('structure.html')

	.pipe(
		through2.obj(
			decorate
		))

	////////////////////////////////////

	// gulp-replace ampscript variables
	.pipe(replace(
		'"@@redirect-base"', buildRedirect()
		))

	.pipe(replace(
		'"@@redirect-shipping"', buildRedirect('customer-service/shipping/')
		))	

	.pipe(replace(
		'"@@redirect-locator"', buildRedirect('store-locator/')
		))

	.pipe(replace(
		'"@@redirect-product"', buildRedirect('womens-coats-jackets/')
		))	

	.pipe(replace(
		'"@@redirect-cta-1"', buildRedirect('womens-coats/')
		))

	.pipe(replace(
		'"@@redirect-cta-2"', buildRedirect('womens-bags/')
		))

	// title 

	.pipe(replace(
		'"@@alt-image"', '"%%=v(@BURBERRY_ALT_IMAGE)=%%"'
		))

	////////////////////////////////////													

	.pipe(gulp.dest('./dist/')) ;

});



gulp.task('create-content', ['wrap-interactive']) ;

gulp.task('construct-template', ['insert']) ;
