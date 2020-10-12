const chalk = require("chalk");
const msgPath = process.env.HUSKY_GIT_PARAMS;
console.log(msgPath)
process.exit();
// const msg = require("fs")
//   .readFileSync(msgPath, "utf-8")
//   .trim();

// const commitReg = /^(revert: )?(feat|fix|docs|style|ui|refactor|perf|test|build|ci|chore|types|wip)(\(.+\))?: .{1,50}/;

// if (!commitReg.test(msg)) {
//   console.log();
//   console.error(
//     `${chalk.bgRed.white(" ERROR ")} ${chalk.red(`无效的提交格式。`)}\n\n` +
//       `  ${chalk.bgRed(msg)}\n\n` +
//       chalk.red(`  自动生成变更日志需要正确的提交消息格式。 例如:\n\n`) +
//       `  ${chalk.green(`fix: 修复xxx不显示问题 (#666)`)}\n` +
//       `  ${chalk.green(`feat(f9): F9中添加融资图谱模块 (#123)`)}\n\n`
//   );
//   process.exit(1);
// }
