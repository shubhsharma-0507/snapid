import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPassportPhoto extends Document {
  userId: mongoose.Types.ObjectId;
  originalUrl: string;
  processedUrl: string;
  sheetUrl?: string;
  country: string;
  backgroundColor: string;
  copies: number;
  dimensions: { width: number; height: number };
  createdAt: Date;
}

const passportPhotoSchema = new Schema<IPassportPhoto>(
  {
    userId:          { type: Schema.Types.ObjectId, ref: 'User', required: true },
    originalUrl:     { type: String, required: true },
    processedUrl:    { type: String, required: true },
    sheetUrl:        { type: String, default: '' },
    country:         { type: String, default: 'india' },
    backgroundColor: { type: String, default: '#FFFFFF' },
    copies:          { type: Number, default: 4 },
    dimensions:      { width: { type: Number }, height: { type: Number } },
  },
  { timestamps: true }
);

const PassportPhoto: Model<IPassportPhoto> =
  mongoose.models.PassportPhoto || mongoose.model<IPassportPhoto>('PassportPhoto', passportPhotoSchema);

export default PassportPhoto;

