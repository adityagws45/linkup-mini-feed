import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Briefcase, MapPin, Clock, Search, Bookmark, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  postedDate: string;
  level: string;
}

const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120,000 - $160,000",
    description: "We're looking for a senior frontend developer to join our growing team. You'll work on cutting-edge web applications using React, TypeScript, and modern development practices.",
    postedDate: "2 days ago",
    level: "Senior"
  },
  {
    id: "2",
    title: "Product Manager",
    company: "StartupXYZ",
    location: "New York, NY",
    type: "Full-time",
    salary: "$100,000 - $140,000",
    description: "Join our product team to drive innovation and growth. You'll work closely with engineering and design teams to deliver exceptional user experiences.",
    postedDate: "1 week ago",
    level: "Mid-level"
  },
  {
    id: "3",
    title: "UX Designer",
    company: "Design Studio",
    location: "Remote",
    type: "Contract",
    salary: "$80,000 - $110,000",
    description: "Create beautiful and intuitive user experiences for our digital products. Must have experience with Figma, user research, and prototyping.",
    postedDate: "3 days ago",
    level: "Mid-level"
  },
  {
    id: "4",
    title: "Full Stack Engineer",
    company: "InnovateLab",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$90,000 - $130,000",
    description: "Build scalable web applications from frontend to backend. Experience with React, Node.js, and cloud platforms required.",
    postedDate: "5 days ago",
    level: "Junior"
  }
];

export const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  const filteredJobs = mockJobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApply = (job: Job) => {
    toast.success(`Application submitted for ${job.title} at ${job.company}`);
  };

  const handleSave = (jobId: string) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(prev => prev.filter(id => id !== jobId));
      toast.info("Job removed from saved");
    } else {
      setSavedJobs(prev => [...prev, jobId]);
      toast.success("Job saved successfully");
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Full-time": return "bg-green-100 text-green-800";
      case "Contract": return "bg-blue-100 text-blue-800";
      case "Part-time": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Senior": return "bg-purple-100 text-purple-800";
      case "Mid-level": return "bg-orange-100 text-orange-800";
      case "Junior": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      <div className="flex items-center space-x-3">
        <Briefcase className="w-8 h-8 text-linkedin" />
        <div>
          <h1 className="text-3xl font-bold">Jobs</h1>
          <p className="text-muted-foreground">Find your next opportunity</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input
          placeholder="Search jobs, companies, or locations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="bg-muted/50 rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} • {savedJobs.length} saved
        </p>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <CardTitle className="text-xl">{job.title}</CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="font-medium">{job.company}</span>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {job.postedDate}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={getTypeColor(job.type)}>{job.type}</Badge>
                    <Badge className={getLevelColor(job.level)}>{job.level}</Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSave(job.id)}
                  className={savedJobs.includes(job.id) ? "text-linkedin" : ""}
                >
                  <Bookmark className={`w-4 h-4 ${savedJobs.includes(job.id) ? "fill-current" : ""}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium text-lg text-green-600 mb-2">{job.salary}</p>
                <p className="text-sm text-muted-foreground">{job.description}</p>
              </div>
              <div className="flex space-x-3">
                <Button 
                  className="bg-linkedin hover:bg-linkedin-dark"
                  onClick={() => handleApply(job)}
                >
                  Apply Now
                </Button>
                <Button variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
          <p className="text-muted-foreground">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
};