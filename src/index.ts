const dotenv = require('dotenv')
const env = dotenv.config().parsed

export default (ctx: any) => {
  const {
    helper: {
      chalk
    }
  } = ctx

	ctx.modifyWebpackChain((args: { chain: any, webpack: any })=>{
		console.log(chalk.yellow('插件 '), 'taro-plugin-dotenv 读取 .env 文件并注入 webpack 配置')

		if (typeof env === 'undefined') {
			console.log(chalk.blueBright('结束 '), '.env 文件环境配置为空')
			console.log();
			return
		}

		const envKeys = Object.keys(env).reduce((prev, next) => {
			prev[`process.env.${next}`] = JSON.stringify(env[next])
			return prev
		}, {})
		console.log(chalk.greenBright('注入 '), envKeys)
		const { chain, webpack } = args
		chain.merge({
			plugin: {
				install: {
					plugin: webpack.DefinePlugin,
					args: [envKeys]
				}
			}
		})
		console.log(chalk.blueBright('结束 '), '注入完成')
		console.log();

	})
}
