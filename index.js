'use strict';

const _ = require('lodash/fp');

class ServerlessPlugin {
    constructor(serverless, options) {
        this.serverless = serverless;
        this.options = options;
        this.provider = serverless ? serverless.getProvider('aws') : null;
        this.service = serverless.service;
        this.stage = this.serverless.service.provider.stage;
        this.region = null;

        if (!this.provider) {
            throw new Error('This plugin must be used with AWS');
        }

        this.hooks = {
            'after:package:packageService': this._addCustomLogging.bind(this),
            'after:aws:package:finalize:mergeCustomProviderResources': this._addCustomLogging.bind(this)
        };
    }

    _addCustomLogging() {
        var self = this;
        const template = this.serverless.service.provider.compiledCloudFormationTemplate;
        var accessLogs = this.serverless.service.provider['apiGatewayAccessLogs'];
        var stage = this.serverless.variables.options.stage
        var region = this.serverless.service.provider.region;

        if (!this.serverless.service.provider.apiGatewayAccessLogs && this.serverless.service.custom && this.serverless.service.custom.apiGatewayAccessLogs) {
            accessLogs = this.serverless.service.custom.apiGatewayAccessLogs
            self.serverless.cli.log('Working with apiGatewayAccessLogs under custom.');
            self.serverless.cli.log('\t Format: ' + accessLogs.format);
            self.serverless.cli.log('\t DestinationArn: ' + 'arn:aws:logs:' + region + ':' + accessLogs.account + ':log-group:' + accessLogs.logGroup);
        } else {
            if (this.serverless.service.provider.apiGatewayAccessLogs) {
                self.serverless.cli.log('Working with apiGatewayAccessLogs under provider.');
                self.serverless.cli.log('\t Format: ' + accessLogs.format);
                self.serverless.cli.log('\t DestinationArn: ' + 'arn:aws:logs:' + region + ':' + accessLogs.account + ':log-group:' + accessLogs.logGroup);
            }
        }

        if (this.serverless.variables.options.stage) {
            stage = this.serverless.variables.options.stage;
        }

        if (this.serverless.variables.options.region) {
            region = this.serverless.variables.options.region;
        }

        Object.keys(template.Resources).forEach(function (key) {
            var resourceType = template.Resources[key]['Type']
            if (accessLogs && resourceType === 'AWS::ApiGateway::Deployment') {
                delete template.Resources[key].Properties.StageName;

                var stageConfig = self._getStageConfig(region, stage, key, accessLogs)

                if (template.Resources.ApiGatewayStage) {
                    if (template.Resources.ApiGatewayStage.Properties && !template.Resources.ApiGatewayStage.Properties.AccessLogSetting) {
                        template.Resources.ApiGatewayStage.Properties['AccessLogSetting'] = self._getAccessLogSetting(region, accessLogs);
                        self.serverless.cli.log('Merged AWS api gateway custom logs..');
                    }
                } else {
                    template.Resources.ApiGatewayStage = stageConfig;
                    self.serverless.cli.log('Updated AWS api gateway custom logs..');
                }
            }

            if (template.Resources[key]['Type'] === 'AWS::ApiGateway::ApiKey') {
                template.Resources[key]['DependsOn'] = 'ApiGatewayStage';
            }
        });
    }

    _getStageConfig(region, stage, deploymentId, accessLogs) {
        var stageConfig = {
            Type: "AWS::ApiGateway::Stage",
            Properties: {
                StageName: stage,
                Description: stage,
                RestApiId: {
                    "Ref": "ApiGatewayRestApi"
                },
                DeploymentId: (deploymentId) ? {
                    "Ref": deploymentId
                } : {
                    "Ref": "TestDeployment"
                },
                AccessLogSetting: this._getAccessLogSetting(region, accessLogs)
            }
        }
        return stageConfig
    }

    _getAccessLogSetting(region, accessLogs) {
        return {
            Format: accessLogs.format,
            DestinationArn: 'arn:aws:logs:' + region + ':' + accessLogs.account + ':log-group:' + accessLogs.logGroup
        }
    }
}

module.exports = ServerlessPlugin;