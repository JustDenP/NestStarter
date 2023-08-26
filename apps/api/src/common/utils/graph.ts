import * as fs from 'node:fs';

import { SpelunkerModule } from 'nestjs-spelunker';

export function createDependencyGraph(app): void {
  /**
   * Generate the tree as text
   * Copy and paste the log content in "https://mermaid.live/"
   */
  const tree = SpelunkerModule.explore(app);
  const root = SpelunkerModule.graph(tree);
  const edges = SpelunkerModule.findGraphEdges(root);
  const mermaidEdges = edges
    .filter(
      ({ from, to }) =>
        !(
          from.module.name === 'ConfigModule' ||
          from.module.name === 'HealthCheckerModule' ||
          from.module.name === 'NestPinoModule' ||
          from.module.name === 'ApiConfigModule' ||
          from.module.name === 'ConfigHostModule' ||
          from.module.name === 'MikroOrmCoreModule' ||
          from.module.name === 'LoggerModule' ||
          to.module.name === 'ConfigModule' ||
          to.module.name === 'HealthCheckerModule' ||
          to.module.name === 'NestPinoModule' ||
          to.module.name === 'ApiConfigModule' ||
          to.module.name === 'ConfigHostModule' ||
          to.module.name === 'MikroOrmCoreModule' ||
          to.module.name === 'LoggerModule'
        ),
    )
    .map(({ from, to }) => `${from.module.name}-->${to.module.name}`);
  const graph = `graph TD\n\t${mermaidEdges.join('\n\t')}`;
  fs.writeFile(`./logs/graph.log`, graph, function (err) {
    if (err) {
      return console.log(err);
    }
  });
}
