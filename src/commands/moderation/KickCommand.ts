import { DefineCommand } from "../../utils/decorators/DefineCommand";
import { CommandContext } from "../../structures/CommandContext";
import { BaseCommand } from "../../structures/BaseCommand";
import { createEmbed } from "../../utils/createEmbed";
import { User } from "discord.js";

@DefineCommand({
    contextUser: "Kick Member",
    description: "Kick member",
    name: "kick",
    slash: {
        name: "kick",
        options: [
            {
                description: "Member to kick",
                name: "Member",
                type: "USER",
                required: true
            }
        ]
    },
    usage: "{prefix}kick <member>"
})
export class KickCommand extends BaseCommand {
    public async execute(ctx: CommandContext): Promise<any> {
        if (!ctx.member?.permissions.has("KICK_MEMBERS")) return ctx.reply({ embeds: [createEmbed("error", "You don't have permission to use this command")] });
        if (!ctx.guild?.me?.permissions.has("KICK_MEMBERS")) return ctx.reply({ embeds: [createEmbed("error", "I don't have `Kick Members` permission")] });

        const memberId = ctx.isContextMenu() ? (ctx.additionalArgs.get("options") as User).id : (ctx.isInteraction() ? ctx.options?.getUser("Member", true).id : ctx.args[0]?.replace(/[^0-9]/g, ""));
        const member = ctx.guild.members.resolve(memberId!);

        if (!member) return ctx.reply({ embeds: [createEmbed("error", "Please, mention a member")] });
        if (!member.kickable) return ctx.reply({ embeds: [createEmbed("error", "I can't kick that member")] });

        await member.kick();
        return ctx.reply({ embeds: [createEmbed("success", `\`${member.user.tag}\` has been kicked from the server`)] });
    }
}
