# AstrBot 插件市场

插件数据采集，可用于 **插件市场** 或者 `AstrBot Landing Page` 插件市场导航页插件展示

## 提交插件

> [!NOTE]
> 请点击链接前往 AstrBot 主仓库提交插件：[🥳 发布插件](https://github.com/Soulter/AstrBot/issues/new?template=PLUGIN_PUBLISH.yml)


## Action 类别

1. `sync.yml` (不推荐， 上游服务存在数据丢失)

   直接从 `https://api.soulter.top/astrbot/plugins` 获取数据，存储在 `plugin_cache.json` 中。当上游服务不可用时导致获取失败，则自动缓存而不更新文件。一定程度上受到上游服务影响。

3. `transform-plugin-data.yml` (推荐， github的服务更稳定， 只是对大陆用户不太好)

   直接从 `https://github.com/AstrBotDevs/AstrBot_Plugins_Collection/blob/main/plugins.json` 获取原始插件数据，Action 自动解析 `更新时间`、 `Star 数`、`版本`等信息，并自动剔除那些删库跑路的仓库（404）。该 Action 会受到 Github API 限制的影响。
