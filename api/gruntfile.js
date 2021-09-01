module.exports = function(grunt) {
    grunt.initConfig({
       ts :{
          default: {
             tsconfig: './tsconfig.json'
          }
       },
       lambda_invoke: {
          default: {
             options: {
                handler: 'handler',
                file_name: 'index.js',
                event: 'event.json'
             }
          }
       },
       lambda_package: {
          default: {
             options: {
                include_time: true,
                dist_folder: 'dist',
                package_folder: 'build'
             }
          }
       },
       lambda_deploy: {
          default: {
             arn: 'arn:aws:lambda:ap-southeast-2:567029094155:function:flood1800',
             options: {
                aliases: 'beta',
                timeout: 180,
                memory: 256,
                region: 'ap-southeast-2'
             }
          }
       }
    });
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-aws-lambda');
    grunt.registerTask('default', [ 'ts' ]);
    grunt.registerTask('package', [ 'lambda_package' ]);
    grunt.registerTask('deploy', [ 'lambda_package', 'lambda_deploy' ]);
 }