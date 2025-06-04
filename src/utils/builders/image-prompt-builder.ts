import { IllustrationStyle } from "@/models/illustration-models";

export class ImagePromptBuilder {
  private stylePrompts: Record<IllustrationStyle, string> = {
    drawer: "pencil sketch, black and white drawing, detailed line art, traditional illustration",
    colorful: "vibrant colors, bright illustration, colorful art, vivid painting",
    cartoon: "cartoon style, comic book art, simplified shapes, bold outlines",
    magic: "fantasy art, magical atmosphere, ethereal lighting, mystical elements",
    anime: "anime style, manga art, Japanese illustration, expressive characters",
    realistic: "photorealistic, detailed rendering, natural lighting, lifelike"
  };

  buildIllustrationPrompt(
    sceneDescription: string,
    style: IllustrationStyle,
    isBookIllustration: boolean = true
  ): string {
    const stylePrompt = this.stylePrompts[style];
    const format = isBookIllustration ? "book illustration" : "comic panel";
    
    return `Create a ${format} in ${stylePrompt} style. Scene: ${sceneDescription}. High quality, detailed artwork.`;
  }

  buildComicPagePrompt(
    panels: { description: string; text: string }[],
    style: IllustrationStyle
  ): string {
    const stylePrompt = this.stylePrompts[style];
    
    // Criar descrição para uma página com 4 painéis
    const panelDescriptions = panels.map((panel, index) => 
      `Panel ${index + 1}: ${panel.description}`
    ).join(" ");
    
    return `Create a comic book page with 4 panels in a 2x2 grid layout. ${stylePrompt} style. ${panelDescriptions} Each panel should be clearly separated with borders. Sequential art, professional comic layout.`;
  }

  buildComicPanelPrompt(
    text: string,
    style: IllustrationStyle,
    panelNumber: number
  ): string {
    const stylePrompt = this.stylePrompts[style];
    
    return `Comic book panel ${panelNumber}, ${stylePrompt} style. Scene based on: "${text}". Sequential art, clear composition, dynamic layout.`;
  }
}