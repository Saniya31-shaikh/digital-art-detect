import * as tf from '@tensorflow/tfjs';

// ====================================
// INSERT YOUR TEACHABLE MACHINE MODEL URL HERE
// ====================================
// Export your model from Teachable Machine as "TensorFlow.js" and paste the URL below
const MODEL_URL = ''; // Paste your model URL here

interface Prediction {
  className: string;
  probability: number;
}

export class ArtClassifier {
  private model: tf.LayersModel | null = null;
  private isLoaded = false;

  async loadModel(): Promise<void> {
    if (!MODEL_URL) {
      throw new Error('Please set your Teachable Machine model URL in src/lib/teachableMachine.ts');
    }

    try {
      this.model = await tf.loadLayersModel(MODEL_URL + 'model.json');
      this.isLoaded = true;
      console.log('Model loaded successfully');
    } catch (error) {
      console.error('Error loading model:', error);
      throw error;
    }
  }

  async classifyImage(imageElement: HTMLImageElement): Promise<{ label: string; confidence: number }> {
    if (!this.isLoaded) {
      await this.loadModel();
    }

    try {
      if (!this.model) {
        throw new Error('Model not loaded');
      }

      const prediction = this.model.predict(this.preprocessImage(imageElement)) as tf.Tensor;
      const scores = await prediction.data();
      
      // Get the class names from your model (update these to match your Teachable Machine labels)
      const classNames = ['Real Art', 'AI Art'];
      
      // Find the prediction with highest confidence
      const maxScoreIndex = scores.indexOf(Math.max(...Array.from(scores)));
      const confidence = scores[maxScoreIndex];
      
      return {
        label: classNames[maxScoreIndex],
        confidence: confidence
      };
    } catch (error) {
      console.error('Error classifying image:', error);
      throw error;
    }
  }

  private preprocessImage(imageElement: HTMLImageElement): tf.Tensor {
    // Preprocess image for Teachable Machine model
    return tf.browser.fromPixels(imageElement)
      .resizeNearestNeighbor([224, 224]) // Standard size for Teachable Machine
      .toFloat()
      .div(255.0)
      .expandDims();
  }
}

export const artClassifier = new ArtClassifier();