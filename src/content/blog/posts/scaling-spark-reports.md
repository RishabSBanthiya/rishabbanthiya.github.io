---
title: "Scaling Report Delivery with Spark"
date: "2024-10-20"
description: "Reducing query times from 45 minutes to under 5 minutes using Apache Spark on Azure HDInsight."
tags: ["spark", "azure", "data-engineering", "python"]
---

# Scaling Report Delivery with Spark

At Societe Generale, I worked on a report delivery engine that was struggling with performance. Worst-case query times were hitting 45 minutes, and we needed to scale from 100K to 1M+ rows without increasing costs.

## The Problem

The existing system had several bottlenecks:

- Sequential processing of large datasets
- Inefficient joins across multiple data sources
- No caching of intermediate results

Users were waiting too long for reports, and the system couldn't handle growing data volumes.

## Solution: Spark on Azure HDInsight

We rebuilt the engine using Apache Spark on Azure HDInsight. The key changes:

### Partitioning Strategy

Partitioned data by report date and region to enable parallel processing:

```python
df = spark.read.parquet(source_path)
df = df.repartition("report_date", "region")
```

### Broadcast Joins

For dimension tables, broadcast joins eliminated shuffle operations:

```python
from pyspark.sql.functions import broadcast
result = facts.join(broadcast(dims), on="dim_key")
```

### Caching

Frequently accessed intermediate results were cached in memory:

```python
base_df.cache()
```

## Results

After the migration:

- Query times dropped from 45 min to under 5 min
- Capacity scaled from 100K to 1M+ rows
- Cost remained flat due to efficient resource utilization

## Lessons Learned

- Partitioning is critical for Spark performance
- Broadcast joins work well for small dimension tables
- Monitoring Spark UI helps identify bottlenecks early

The same patterns work for most batch processing workloads on Spark.

---

*This was one of the projects that led to winning the AMER hackathon.*
