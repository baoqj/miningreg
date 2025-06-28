"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Building, 
  Users, 
  Plus, 
  Mail, 
  Settings, 
  Crown,
  Shield,
  User
} from "lucide-react"

interface Organization {
  id: string
  name: string
  slug: string
  description?: string
  memberships: Array<{
    role: string
    joinedAt: string
  }>
  _count: {
    memberships: number
    teams: number
  }
}

interface Team {
  id: string
  name: string
  description?: string
  organization: {
    id: string
    name: string
    slug: string
  }
  memberships: Array<{
    role: string
  }>
  _count: {
    memberships: number
  }
}

export default function TeamsPage() {
  const { data: session } = useSession()
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateOrg, setShowCreateOrg] = useState(false)
  const [showCreateTeam, setShowCreateTeam] = useState(false)
  const [message, setMessage] = useState("")

  const [orgForm, setOrgForm] = useState({
    name: "",
    description: "",
    industry: "",
    size: "",
    website: ""
  })

  const [teamForm, setTeamForm] = useState({
    name: "",
    description: "",
    organizationId: ""
  })

  useEffect(() => {
    if (session) {
      fetchData()
    }
  }, [session])

  const fetchData = async () => {
    try {
      const [orgsResponse, teamsResponse] = await Promise.all([
        fetch("/api/organizations"),
        fetch("/api/teams")
      ])

      if (orgsResponse.ok) {
        const orgsData = await orgsResponse.json()
        setOrganizations(orgsData)
      }

      if (teamsResponse.ok) {
        const teamsData = await teamsResponse.json()
        setTeams(teamsData)
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")

    try {
      const response = await fetch("/api/organizations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orgForm)
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("Organization created successfully!")
        setShowCreateOrg(false)
        setOrgForm({ name: "", description: "", industry: "", size: "", website: "" })
        fetchData()
      } else {
        setMessage(data.error || "Failed to create organization")
      }
    } catch (error) {
      setMessage("An error occurred")
    }
  }

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")

    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(teamForm)
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("Team created successfully!")
        setShowCreateTeam(false)
        setTeamForm({ name: "", description: "", organizationId: "" })
        fetchData()
      } else {
        setMessage(data.error || "Failed to create team")
      }
    } catch (error) {
      setMessage("An error occurred")
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "OWNER":
        return <Crown className="h-4 w-4 text-yellow-500" />
      case "ADMIN":
        return <Shield className="h-4 w-4 text-blue-500" />
      default:
        return <User className="h-4 w-4 text-gray-500" />
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Teams & Organizations</h1>
            <p className="text-gray-600">Manage your teams and organizations</p>
          </div>
        </div>

        {message && (
          <Alert>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="organizations" className="space-y-6">
          <TabsList>
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
          </TabsList>

          <TabsContent value="organizations">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Your Organizations</h2>
                <Dialog open={showCreateOrg} onOpenChange={setShowCreateOrg}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Organization
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Organization</DialogTitle>
                      <DialogDescription>
                        Create a new organization to manage teams and projects
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateOrganization} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="orgName">Organization Name</Label>
                        <Input
                          id="orgName"
                          value={orgForm.name}
                          onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                          placeholder="Enter organization name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="orgDescription">Description</Label>
                        <Textarea
                          id="orgDescription"
                          value={orgForm.description}
                          onChange={(e) => setOrgForm({ ...orgForm, description: e.target.value })}
                          placeholder="Describe your organization"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="industry">Industry</Label>
                          <Input
                            id="industry"
                            value={orgForm.industry}
                            onChange={(e) => setOrgForm({ ...orgForm, industry: e.target.value })}
                            placeholder="e.g., Mining"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="size">Company Size</Label>
                          <select
                            id="size"
                            value={orgForm.size}
                            onChange={(e) => setOrgForm({ ...orgForm, size: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Select size</option>
                            <option value="1-10">1-10 employees</option>
                            <option value="11-50">11-50 employees</option>
                            <option value="51-200">51-200 employees</option>
                            <option value="201-1000">201-1000 employees</option>
                            <option value="1000+">1000+ employees</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          type="url"
                          value={orgForm.website}
                          onChange={(e) => setOrgForm({ ...orgForm, website: e.target.value })}
                          placeholder="https://example.com"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setShowCreateOrg(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Create Organization</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {organizations.map((org) => (
                  <Card key={org.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Building className="h-8 w-8 text-blue-600" />
                        <div className="flex items-center space-x-1">
                          {getRoleIcon(org.memberships[0]?.role)}
                          <Badge variant="secondary">{org.memberships[0]?.role}</Badge>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{org.name}</CardTitle>
                      {org.description && (
                        <CardDescription>{org.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Members</span>
                          <span className="font-medium">{org._count.memberships}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Teams</span>
                          <span className="font-medium">{org._count.teams}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Settings className="h-4 w-4 mr-1" />
                          Manage
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {organizations.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No organizations yet</h3>
                    <p className="text-gray-600 mb-4">
                      Create your first organization to start collaborating with your team
                    </p>
                    <Button onClick={() => setShowCreateOrg(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Organization
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="teams">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Your Teams</h2>
                {organizations.length > 0 && (
                  <Dialog open={showCreateTeam} onOpenChange={setShowCreateTeam}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Team
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Team</DialogTitle>
                        <DialogDescription>
                          Create a new team within an organization
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCreateTeam} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="teamName">Team Name</Label>
                          <Input
                            id="teamName"
                            value={teamForm.name}
                            onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                            placeholder="Enter team name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="teamDescription">Description</Label>
                          <Textarea
                            id="teamDescription"
                            value={teamForm.description}
                            onChange={(e) => setTeamForm({ ...teamForm, description: e.target.value })}
                            placeholder="Describe your team"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="organization">Organization</Label>
                          <select
                            id="organization"
                            value={teamForm.organizationId}
                            onChange={(e) => setTeamForm({ ...teamForm, organizationId: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                          >
                            <option value="">Select organization</option>
                            {organizations.map((org) => (
                              <option key={org.id} value={org.id}>
                                {org.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setShowCreateTeam(false)}>
                            Cancel
                          </Button>
                          <Button type="submit">Create Team</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map((team) => (
                  <Card key={team.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Users className="h-8 w-8 text-green-600" />
                        <div className="flex items-center space-x-1">
                          {getRoleIcon(team.memberships[0]?.role)}
                          <Badge variant="secondary">{team.memberships[0]?.role}</Badge>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                      <CardDescription>
                        {team.organization.name}
                        {team.description && ` • ${team.description}`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Members</span>
                          <span className="font-medium">{team._count.memberships}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Settings className="h-4 w-4 mr-1" />
                          Manage
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {teams.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No teams yet</h3>
                    <p className="text-gray-600 mb-4">
                      {organizations.length === 0 
                        ? "Create an organization first, then add teams to collaborate"
                        : "Create your first team to start collaborating"
                      }
                    </p>
                    {organizations.length === 0 ? (
                      <Button onClick={() => setShowCreateOrg(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Organization
                      </Button>
                    ) : (
                      <Button onClick={() => setShowCreateTeam(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Team
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
