import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Lead, LeadDocument } from './schemas/lead.schema';
import { CreateLeadDto } from './dto/create-lead.dto';

@Injectable()
export class LeadsService {
  constructor(
    @InjectModel(Lead.name)
    private leadModel: Model<LeadDocument>,
  ) {}

  async create(dto: CreateLeadDto) {
    const exists = await this.leadModel.findOne({ email: dto.email });

    if (exists) {
      throw new ConflictException('Email ya registrado');
    }

    return this.leadModel.create(dto);
  }

  async findAll(query: any) {
    const { page = 1, limit = 10, fuente, startDate, endDate } = query;

    const filter: any = { deleted: false };

    if (fuente) {
      filter.fuente = fuente;
    }

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const leads = await this.leadModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await this.leadModel.countDocuments(filter);

    return {
      data: leads,
      total,
      page: Number(page),
      limit: Number(limit),
    };
  }

  async findOne(id: string) {
    const lead = await this.leadModel.findOne({
      _id: id,
      deleted: false,
    });

    if (!lead) {
      throw new NotFoundException('Lead no encontrado');
    }

    return lead;
  }

  async update(id: string, dto: any) {
    const updated = await this.leadModel.findOneAndUpdate(
      { _id: id, deleted: false },
      dto,
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException('Lead no encontrado');
    }

    return updated;
  }

  async remove(id: string) {
    const deleted = await this.leadModel.findOneAndUpdate(
      { _id: id, deleted: false },
      { deleted: true },
      { new: true },
    );

    if (!deleted) {
      throw new NotFoundException('Lead no encontrado');
    }

    return deleted;
  }

  async stats() {
    const total = await this.leadModel.countDocuments({ deleted: false });

    const bySource = await this.leadModel.aggregate([
      { $match: { deleted: false } },
      { $group: { _id: '$fuente', count: { $sum: 1 } } },
    ]);

    const budgets = await this.leadModel.find({
      deleted: false,
      presupuesto: { $exists: true, $ne: null },
    });

    const avgBudget =
      budgets.length > 0
        ? budgets.reduce((a, b) => a + (b.presupuesto ?? 0), 0) / budgets.length
        : 0;

    const last7days = await this.leadModel.countDocuments({
      deleted: false,
      createdAt: {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      total,
      bySource,
      averageBudget: Number(avgBudget.toFixed(2)),
      last7days,
    };
  }

  async aiSummary(query: any) {
    const { fuente, startDate, endDate } = query;

    const filter: any = { deleted: false };

    if (fuente) {
      filter.fuente = fuente;
    }

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const leads = await this.leadModel.find(filter);

    const total = leads.length;

    const bySource: Record<string, number> = {};

    leads.forEach((lead) => {
      bySource[lead.fuente] = (bySource[lead.fuente] || 0) + 1;
    });

    const topSource =
      Object.keys(bySource).length > 0
        ? Object.keys(bySource).reduce((a, b) =>
            bySource[a] > bySource[b] ? a : b,
          )
        : null;

    const budgets = leads.filter((l) => l.presupuesto);

    const avgBudget =
      budgets.length > 0
        ? budgets.reduce((a, b) => a + (b.presupuesto ?? 0), 0) / budgets.length
        : 0;

    return {
      summary: `
RESUMEN EJECUTIVO IA

Total de leads: ${total}

Fuente principal: ${topSource || 'N/A'}

Distribución por fuente:
${JSON.stringify(bySource, null, 2)}

Presupuesto promedio: $${avgBudget.toFixed(2)}

Insights:
- Canal más fuerte: ${topSource || 'no definido'}
- Optimizar campañas en fuentes secundarias
- Enfocar leads de mayor presupuesto
      `.trim(),
    };
  }
}