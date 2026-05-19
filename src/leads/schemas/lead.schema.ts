import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LeadDocument = Lead & Document;

@Schema({ timestamps: true })
export class Lead {
  @Prop({ required: true, minlength: 2 })
  nombre: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  telefono?: string;

  @Prop({ required: true })
  fuente: string;

  @Prop()
  producto_interes?: string;

  @Prop()
  presupuesto?: number;

  @Prop({ default: false })
  deleted: boolean;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);